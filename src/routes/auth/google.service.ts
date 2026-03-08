import { Injectable, UnauthorizedException } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import envConfig from 'src/shared/config';
import { GetAuthURLResType, GoogleOAuthStateType } from './auth.model';
import { AuthRepository } from './auth.repo';
import { HashingService } from 'src/shared/services/hashing.service';
import { RoleService } from './role.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleService {
  private oAuth2Client: OAuth2Client;
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
  ) {
    this.oAuth2Client = new google.auth.OAuth2({
      clientId: envConfig.GOOGLE_CLIENT_ID,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
      redirectUri: envConfig.GOOGLE_REDIRECT_URI,
    });
  }

  getGoogleAuthUrl({ userAgent, ip }: GoogleOAuthStateType): GetAuthURLResType {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    // Generate state object to pass state to google url
    const state = Buffer.from(
      JSON.stringify({
        userAgent,
        ip,
      }),
    ).toString('base64');

    const url = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true,
      state,
    });

    return {
      url,
    };
  }

  async googleAuthCallback({ code, state }: { code: string; state: string }) {
    try {
      let userAgent = 'Unknown';
      let ip = 'Unknown';

      // Decode state from url
      try {
        if (state) {
          const clientInfo = JSON.parse(
            Buffer.from(state, 'base64').toString(),
          ) as GoogleOAuthStateType;
          userAgent = clientInfo.userAgent || 'Unknown';
          ip = clientInfo.ip || 'Unknown';
        }
      } catch (error) {
        console.error('Failed to decode state from Google callback: ', error);
        throw new UnauthorizedException('Invalid state parameter');
      }

      // Use code to get access token and user info from google
      const { tokens } = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(tokens);

      // Get user info from google
      const oauth2 = google.oauth2({
        auth: this.oAuth2Client,
        version: 'v2',
      });
      const { data } = await oauth2.userinfo.get();

      if (!data || !data.email)
        throw new Error('Failed to get user email from Google');

      let user = await this.authRepository.findUniqueUserWithRole({
        email: data.email,
      });

      if (!user) {
        // If user does not exist, create new user with google info
        const randomPassword = uuidv4();
        const hashedPassword = await this.hashingService.hash(randomPassword);
        const clientRoleId = await this.roleService.getClientRoleId();

        user = await this.authRepository.createUserIncludeRole({
          email: data.email,
          name: data.name || data.email.split('@')[0],
          password: hashedPassword,
          roleId: clientRoleId,
          phoneNumber: '',
          avatar: data.picture || null,
        });
      }
      const device = await this.authRepository.createDevice({
        userId: user.id,
        ip: ip,
        userAgent: userAgent,
        isActive: true,
        lastActive: new Date(),
      });

      const authTokens = await this.authService.generateTokens({
        userId: user.id,
        deviceId: device.id,
        roleId: user.roleId,
        roleName: user.role.name,
      });

      return authTokens;
    } catch (error) {
      console.error('Google authentication failed: ', error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import envConfig from 'src/shared/config';
import { GetAuthURLResType, GoogleOAuthStateType } from './auth.model';

@Injectable()
export class GoogleService {
  private oAuth2Client: OAuth2Client;
  constructor() {
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
}

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';
import {
  isRequiredRecordNotFoundPrisma2025Error,
  isUniqueConstraintPrisma2002Error,
} from 'src/types/helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: any) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password);
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
      });
      return user;
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw new ConflictException('Email already exist');
      }
      throw error;
    }
  }

  async login(body: any) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!user) throw new UnauthorizedException('Account does not exist');

      const isPasswordMatch = await this.hashingService.compare(
        body.password,
        user.password,
      );

      if (!isPasswordMatch)
        throw new UnprocessableEntityException([
          {
            field: 'password',
            error: 'Password is incorrect',
          },
        ]);

      const tokens = await this.generateTokens({ userId: user.id });
      return tokens;
    } catch (error) {
      console.log('Error when generating token');
      throw error;
    }
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ]);

    const decodedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
        userId: payload.userId,
      },
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Validate token
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);

      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      });

      // Remove existing refreshToken
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });

      // Create new accessToken and refreshToken
      return await this.generateTokens({ userId });
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }
      throw error;
    }
  }

  async logout(refreshToken: string) {
    try {
      // Validate token
      await this.tokenService.verifyRefreshToken(refreshToken);

      // Remove refreshToken
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });

      // Create new accessToken and refreshToken
      return { message: 'Logout successful' };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }
      throw new UnauthorizedException();
    }
  }
}

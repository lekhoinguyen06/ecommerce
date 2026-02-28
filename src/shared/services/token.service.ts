import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import envConfig from '../config';
import { StringValue } from 'ms';
import {
  AccessTokenPayloadCreate,
  RefreshTokenPayloadCreate,
  AccessTokenPayload,
  RefreshTokenPayload,
} from 'src/types/jwt.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async signAccessToken(payload: AccessTokenPayloadCreate) {
    return await this.jwtService.signAsync(payload, {
      secret: envConfig.ACCESS_TOKEN_SECRET as StringValue,
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRE_IN as StringValue,
      algorithm: 'HS256',
    });
  }

  async signRefreshToken(payload: RefreshTokenPayloadCreate) {
    return await this.jwtService.signAsync(payload, {
      secret: envConfig.REFRESH_TOKEN_SECRET as StringValue,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRE_IN as StringValue,
      algorithm: 'HS256',
    });
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET as StringValue,
    });
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET as StringValue,
    });
  }
}

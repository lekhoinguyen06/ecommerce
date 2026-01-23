import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { LoginBodyDTO, RegisterBodyDTO } from './auth.dto';
import { TokenService } from 'src/shared/services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyDTO) {
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ConflictException('Email already exist');
      }
      console.log('Register user error');
      throw error;
    }
  }

  async login(body: LoginBodyDTO) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!user) throw new UnauthorizedException('Account does not exist');

      const isPasswordMatch = this.hashingService.compare(
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
}

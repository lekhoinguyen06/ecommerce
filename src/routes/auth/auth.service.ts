import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { HashingService } from 'src/shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';
import { isUniqueConstraintPrisma2002Error } from 'src/types/helper';
import { LoginBodyType, RegisterBodyType, SendOTPBodyType } from './auth.model';
import { AuthRepository } from './auth.repo';
import { RoleService } from './role.service';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { generateOTP } from 'src/shared/helpers';
import envConfig from 'src/shared/config';
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { addMilliseconds } from 'date-fns';
import ms, { StringValue } from 'ms';
import { EmailService } from 'src/shared/services/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly roleService: RoleService,
    private readonly emailService: EmailService,
  ) {}

  async register(body: RegisterBodyType) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password);
      const clientRoleId = await this.roleService.getClientRoleId();

      const verificationCode =
        await this.authRepository.findUniqueVerificationCode({
          email: body.email,
          code: body.code,
          type: TypeOfVerificationCode.REGISTER,
        });

      if (!verificationCode)
        throw new UnprocessableEntityException([
          {
            message: 'OTP verification code is incorrect',
            path: 'code',
          },
        ]);

      if (verificationCode.expiresAt < new Date())
        throw new UnprocessableEntityException([
          {
            message: 'OTP verification code has expired',
            path: 'code',
          },
        ]);

      return this.authRepository.createUser({
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: clientRoleId,
      });
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw new UnprocessableEntityException([
          {
            message: 'Email already exist',
            path: 'email',
          },
        ]);
      }
      throw error;
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
    });

    if (user)
      throw new UnprocessableEntityException({
        message: 'Email already exist',
        path: 'email',
      });

    const code = generateOTP();
    const time = ms(envConfig.OTP_EXPIRE_IN as StringValue);
    const verificationCode = await this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: TypeOfVerificationCode.REGISTER,
      expiresAt: addMilliseconds(new Date(), time),
    });

    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code: verificationCode.code,
    });

    if (error)
      throw new UnprocessableEntityException([
        {
          message: 'Failed to sent OTP verification code through email',
          path: 'code',
        },
      ]);

    return verificationCode;
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    try {
      const user = await this.authRepository.findUniqueUserWithRole({
        email: body.email,
      });

      if (!user)
        throw new UnprocessableEntityException([
          {
            field: 'email',
            error: 'Email does not exist',
          },
        ]);

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

      const device = await this.authRepository.createDevice({
        userId: user.id,
        ip: body.ip,
        userAgent: body.userAgent,
        isActive: true,
        lastActive: new Date(),
      });

      const tokens = await this.generateTokens({
        userId: user.id,
        deviceId: device.id,
        roleId: user.roleId,
        roleName: user.role.name,
      });
      return tokens;
    } catch (error) {
      console.log('Error when generating token');
      throw error;
    }
  }

  async generateTokens({
    userId,
    deviceId,
    roleId,
    roleName,
  }: {
    userId: number;
    deviceId: number;
    roleId: number;
    roleName: string;
  }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        deviceId,
        roleId,
        roleName,
      }),
      this.tokenService.signRefreshToken({
        userId,
      }),
    ]);

    const decodedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);

    await this.authRepository.createRefreshToken({
      token: refreshToken,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      userId,
      deviceId: 1,
    });
    return { accessToken, refreshToken };
  }

  // async refreshToken(refreshToken: string) {
  //   try {
  //     // Validate token
  //     const { userId } =
  //       await this.tokenService.verifyRefreshToken(refreshToken);

  //     await this.prismaService.refreshToken.findUniqueOrThrow({
  //       where: {
  //         token: refreshToken,
  //       },
  //     });

  //     // Remove existing refreshToken
  //     await this.prismaService.refreshToken.delete({
  //       where: {
  //         token: refreshToken,
  //       },
  //     });

  //     // Create new accessToken and refreshToken
  //     return await this.generateTokens({ userId });
  //   } catch (error) {
  //     if (isRequiredRecordNotFoundPrisma2025Error(error)) {
  //       throw new UnauthorizedException('Refresh token has been revoked');
  //     }
  //     throw error;
  //   }
  // }

  // async logout(refreshToken: string) {
  //   try {
  //     // Validate token
  //     await this.tokenService.verifyRefreshToken(refreshToken);

  //     // Remove refreshToken
  //     await this.prismaService.refreshToken.delete({
  //       where: {
  //         token: refreshToken,
  //       },
  //     });

  //     // Create new accessToken and refreshToken
  //     return { message: 'Logout successful' };
  //   } catch (error) {
  //     if (isRequiredRecordNotFoundPrisma2025Error(error)) {
  //       throw new UnauthorizedException('Refresh token has been revoked');
  //     }
  //     throw new UnauthorizedException();
  //   }
  // }
}

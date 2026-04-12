import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from 'src/shared/services/hashing.service';
import { TokenService } from 'src/shared/services/token.service';
import {
  isRequiredRecordNotFoundPrisma2025Error,
  isUniqueConstraintPrisma2002Error,
} from 'src/types/helper';
import {
  Disable2FABodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  SendOTPBodyType,
} from './auth.model';
import { AuthRepository } from './auth.repo';
import { RoleService } from './role.service';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { generateOTP } from 'src/shared/helpers';
import envConfig from 'src/shared/config';
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { addMilliseconds } from 'date-fns';
import ms, { StringValue } from 'ms';
import { EmailService } from 'src/shared/services/email.service';
import {
  EmailAlreadyExistException,
  EmailNotFoundException,
  ExpiredOTPException,
  FailedToSentOTPException,
  IncorrectPasswordException,
  InvalidOTPException,
  InvalidTOTPAndCodeException,
  InvalidTOTPException,
  RefreshTokenRevokedException,
  TOTPAlreadyEnabledException,
  TOTPNotEnabledException,
} from './auth.error';
import { TwoFactorService } from 'src/shared/services/2fa.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly roleService: RoleService,
    private readonly emailService: EmailService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  async verifyOTP({
    email,
    code,
    type,
  }: {
    email: string;
    code: string;
    type: keyof typeof TypeOfVerificationCode;
  }) {
    const verificationCode =
      await this.authRepository.findUniqueVerificationCode({
        email_code_type: {
          email: email,
          code: code,
          type,
        },
      });

    if (!verificationCode) throw InvalidOTPException;

    if (verificationCode.expiresAt < new Date()) throw ExpiredOTPException;

    return verificationCode;
  }

  async register(body: RegisterBodyType) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password);
      const clientRoleId = await this.roleService.getClientRoleId();

      await this.verifyOTP({
        email: body.email,
        code: body.code,
        type: TypeOfVerificationCode.REGISTER,
      });

      const [user] = await Promise.all([
        this.authRepository.createUser({
          email: body.email,
          name: body.name,
          phoneNumber: body.phoneNumber,
          password: hashedPassword,
          roleId: clientRoleId,
        }),
        this.authRepository.deleteVerificationCode({
          email_code_type: {
            email: body.email,
            code: body.code,
            type: TypeOfVerificationCode.REGISTER,
          },
        }),
      ]);
      return user;
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw EmailAlreadyExistException;
      }
      throw error;
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
    });

    if (body.type === TypeOfVerificationCode.REGISTER && user)
      throw EmailAlreadyExistException;
    if (body.type === TypeOfVerificationCode.FORGOT_PASSWORD && !user)
      throw EmailNotFoundException;

    const code = generateOTP();
    const time = ms(envConfig.OTP_EXPIRE_IN as StringValue);
    const verificationCode = await this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), time),
    });

    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code: verificationCode.code,
    });

    if (error) throw FailedToSentOTPException;

    return { message: 'Successfully sent OTP verification code' };
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    try {
      // 1. Find user
      const user = await this.authRepository.findUniqueUserWithRole({
        email: body.email,
      });

      if (!user) throw EmailNotFoundException;

      const isPasswordMatch = await this.hashingService.compare(
        body.password,
        user.password,
      );

      if (!isPasswordMatch) throw IncorrectPasswordException;

      // 2. Check TOTP code
      if (user.totpSecret) {
        // No code provided
        if (!body.totpCode && !body.code) {
          throw InvalidTOTPAndCodeException;
        }

        // Verify
        if (body.totpCode) {
          const isValid = this.twoFactorService.verifyTOTP({
            email: user.email,
            secret: user.totpSecret,
            token: body.totpCode,
          });
          if (!isValid) {
            throw InvalidTOTPException;
          }
        } else if (body.code) {
          await this.verifyOTP({
            email: user.email,
            code: body.code,
            type: TypeOfVerificationCode.LOGIN,
          });
        }
      }

      // 3. Create device
      const device = await this.authRepository.createDevice({
        userId: user.id,
        ip: body.ip,
        userAgent: body.userAgent,
        isActive: true,
        lastActive: new Date(),
      });

      // 4. Generate tokens
      const tokens = await this.generateTokens({
        userId: user.id,
        deviceId: device.id,
        roleId: user.roleId,
        roleName: user.role.name,
      });
      return tokens;
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new UnauthorizedException();
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

  async refreshToken({
    refreshToken,
    userAgent,
    ip,
  }: RefreshTokenBodyType & { userAgent: string; ip: string }) {
    try {
      // Validate token
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);

      // Validate refreshToken exist in database
      const refreshTokenInDB =
        await this.authRepository.findUniqueRefreshTokenWithUserRole({
          token: refreshToken,
        });

      if (!refreshTokenInDB) throw RefreshTokenRevokedException;

      const {
        deviceId,
        user: {
          roleId,
          role: { name: roleName },
        },
      } = refreshTokenInDB;

      // Update device
      const $updateDevice = this.authRepository.updateDevice(deviceId, {
        userId,
        userAgent,
        ip,
      });

      // Remove existing refreshToken
      const $deleteRefreshToken = this.authRepository.deleteRefreshToken({
        token: refreshToken,
      });

      // Create new accessToken and refreshToken
      const $tokens = this.generateTokens({
        userId,
        roleId,
        roleName,
        deviceId,
      });

      const [, , tokens] = await Promise.all([
        $updateDevice,
        $deleteRefreshToken,
        $tokens,
      ]);

      return tokens;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException();
    }
  }

  async logout({ refreshToken }: LogoutBodyType) {
    try {
      // Validate token
      await this.tokenService.verifyRefreshToken(refreshToken);

      // Remove refreshToken
      const deletedRefreshToken = await this.authRepository.deleteRefreshToken({
        token: refreshToken,
      });

      // Inactivate device
      await this.authRepository.updateDevice(deletedRefreshToken.deviceId, {
        isActive: false,
      });

      // Create new accessToken and refreshToken
      return { message: 'Logout successful' };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw RefreshTokenRevokedException;
      }
      throw new UnauthorizedException();
    }
  }

  async forgotPassword(body: ForgotPasswordBodyType) {
    const { email, code, newPassword } = body;

    // Find user by email
    const user = await this.sharedUserRepository.findUnique({ email });

    if (!user) throw EmailNotFoundException;

    // Verify verification code
    await this.verifyOTP({
      email,
      code,
      type: TypeOfVerificationCode.FORGOT_PASSWORD,
    });

    // Hash new password
    const hashedPassword = await this.hashingService.hash(newPassword);

    // Update
    const $updateUser = this.authRepository.updateUser(
      { id: user.id },
      {
        password: hashedPassword,
      },
    );
    const $deleteVerificationCode = this.authRepository.deleteVerificationCode({
      email_code_type: {
        email,
        code,
        type: TypeOfVerificationCode.FORGOT_PASSWORD,
      },
    });

    await Promise.all([$updateUser, $deleteVerificationCode]);

    return { message: 'Password reset successful' };
  }

  async setup2FA(userId: number) {
    // 1. Get user
    const user = await this.sharedUserRepository.findUnique({ id: userId });

    if (!user) throw EmailNotFoundException;

    if (user.totpSecret) throw TOTPAlreadyEnabledException;

    // 2. Generate TOTP secret
    const { secret, uri } = this.twoFactorService.generateTOTPSecret(
      user.email,
    );

    // 3. Save TOTP secret to database
    await this.authRepository.updateUser(
      { id: userId },
      { totpSecret: secret },
    );

    return { secret, uri };
  }

  async disable2FA(data: Disable2FABodyType & { userId: number }) {
    const { totpCode, code, userId } = data;
    // 1. Get user
    const user = await this.sharedUserRepository.findUnique({ id: userId });

    if (!user) throw EmailNotFoundException;

    if (!user.totpSecret) throw TOTPNotEnabledException;

    // 2. Check TOTP code
    if (totpCode) {
      const isValid = this.twoFactorService.verifyTOTP({
        email: user.email,
        secret: user.totpSecret,
        token: totpCode,
      });
      if (!isValid) {
        throw InvalidTOTPException;
      }
    } else if (code) {
      await this.verifyOTP({
        email: user.email,
        code,
        type: TypeOfVerificationCode.DISABLE_2FA,
      });
    } else {
      throw new UnauthorizedException();
    }

    // 3. Disable 2FA
    await this.authRepository.updateUser({ id: userId }, { totpSecret: null });

    return { message: '2FA disabled successfully' };
  }
}

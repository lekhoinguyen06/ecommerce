import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  DeviceType,
  RegisterBodyType,
  RoleType,
  VerificationCodeType,
} from './auth.model';
import { UserType } from 'src/shared/models/shared-user.model';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    user: Omit<RegisterBodyType, 'confirmPassword' | 'code'> &
      Pick<UserType, 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return await this.prismaService.user.create({
      data: user,
      omit: {
        password: true,
        totpSecret: true,
      },
    });
  }

  async createVerificationCode(
    payload: Pick<
      VerificationCodeType,
      'email' | 'type' | 'code' | 'expiresAt'
    >,
  ): Promise<VerificationCodeType> {
    return await this.prismaService.verificationCode.upsert({
      where: {
        email: payload.email,
      },
      create: payload,
      update: payload,
    });
  }

  async findUniqueVerificationCode(
    uniqueObject:
      | { email: string }
      | { id: number }
      | Pick<VerificationCodeType, 'email' | 'type' | 'code'>,
  ): Promise<VerificationCodeType | null> {
    return await this.prismaService.verificationCode.findUnique({
      where: uniqueObject,
    });
  }

  createRefreshToken(data: {
    token: string;
    userId: number;
    expiresAt: Date;
    deviceId: number;
  }) {
    return this.prismaService.refreshToken.create({ data });
  }

  createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> &
      Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>,
  ) {
    return this.prismaService.device.create({ data });
  }

  async findUniqueUserWithRole(
    uniqueObject: { email: string } | { id: number },
  ): Promise<(UserType & { role: RoleType }) | null> {
    return await this.prismaService.user.findUnique({
      where: uniqueObject,
      include: {
        role: true,
      },
    });
  }
}

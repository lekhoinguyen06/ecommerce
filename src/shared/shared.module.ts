import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { APIKeyGuard } from './guards/api-key.guard';
import { AccessTokenGuard } from './guards/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { SharedUserRepository } from './repositories/shared-user.repo';
import { EmailService } from './services/email.service';
import { Resend } from 'resend';
import { TwoFactorService } from './services/2fa.service';
import { SharedRoleRepository } from './repositories/shared-role.repo';

const sharedServices = [
  PrismaService,
  HashingService,
  TokenService,
  SharedUserRepository,
  EmailService,
  Resend,
  TwoFactorService,
  SharedRoleRepository,
];

const guardProviders = [
  APIKeyGuard,
  AccessTokenGuard,
  {
    provide: APP_GUARD,
    useClass: AuthenticationGuard,
  },
];

@Global()
@Module({
  imports: [JwtModule],
  providers: [...sharedServices, ...guardProviders],
  exports: sharedServices,
})
export class SharedModule {}

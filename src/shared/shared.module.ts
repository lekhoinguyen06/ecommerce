import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { APIKeyGuard } from './guards/api-key.guard';
import { AccessTokenGuard } from './guards/access-token.guard';

const sharedServices = [
  PrismaService,
  HashingService,
  TokenService,
  APIKeyGuard,
  AccessTokenGuard,
];

@Global()
@Module({
  imports: [JwtModule],
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}

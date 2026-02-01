import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginBodyDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  LoginResDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  LogoutBodyDTO,
  LogoutResDTO,
} from './auth.dto';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { AuthType, GuardCondition } from 'src/shared/constants/auth.constant';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    return new RegisterResDTO(await this.authService.register(body));
  }

  @Post('login')
  async login(@Body() body: LoginBodyDTO) {
    return new LoginResDTO(await this.authService.login(body));
  }

  @Post('refresh-token')
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: GuardCondition.And })
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    return new RefreshTokenResDTO(
      await this.authService.refreshToken(body.refreshToken),
    );
  }

  @Post('logout')
  async logout(@Body() body: LogoutBodyDTO) {
    return new LogoutResDTO(await this.authService.logout(body.refreshToken));
  }
}

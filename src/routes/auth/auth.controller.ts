import {
  Controller,
  Post,
  Body,
  Ip,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { Auth } from 'src/shared/decorators/auth.decorator';
// import { AuthType, GuardCondition } from 'src/shared/constants/auth.constant';
import {
  ForgotPasswordBodyDTO,
  GetAuthURLResDTO,
  LoginBodyDTO,
  LoginResDTO,
  LogoutBodyDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  SendOTPBodyDTO,
} from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';
import { MessageResDTO } from 'src/shared/dto/response.dto';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { GoogleService } from './google.service';
import { type Response } from 'express';
import envConfig from 'src/shared/config';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService,
  ) {}

  @Post('register')
  @IsPublic()
  @ZodSerializerDto(RegisterResDTO)
  register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body);
  }

  @Post('otp')
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body);
  }

  @Post('login')
  @IsPublic()
  @ZodSerializerDto(LoginResDTO)
  login(@Body() body: LoginBodyDTO, @Ip() ip, @UserAgent() userAgent: string) {
    return this.authService.login({
      ...body,
      ip,
      userAgent,
    });
  }

  @Post('refresh-token')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(RefreshTokenResDTO)
  refreshToken(
    @Body() body: RefreshTokenBodyDTO,
    @Ip() ip,
    @UserAgent() userAgent: string,
  ) {
    return this.authService.refreshToken({
      refreshToken: body.refreshToken,
      ip,
      userAgent,
    });
  }

  @Post('logout')
  @ZodSerializerDto(MessageResDTO)
  logout(@Body() body: LogoutBodyDTO) {
    return this.authService.logout(body);
  }

  @Get('google')
  @IsPublic()
  @ZodSerializerDto(GetAuthURLResDTO)
  getGoogleAuthUrl(@Ip() ip, @UserAgent() userAgent: string) {
    return this.googleService.getGoogleAuthUrl({ ip, userAgent });
  }

  @Get('google/callback')
  @IsPublic()
  async googleAuthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.googleService.googleAuthCallback({ code, state });
      console.log('Google auth callback data:', data);
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?error=${encodeURIComponent(
          message,
        )}`,
      );
    }
  }

  @Post('forgot-password')
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  forgotPassword(@Body() body: ForgotPasswordBodyDTO) {
    return this.authService.forgotPassword(body);
  }

  // Why POST:
  // 1. Security: POST require body which means a form or JS is needed to submit the request, reducing the risk of CSRF attacks.
  // 2. Semantic: POST is used for actions that create or modify resources, which aligns with the action of setting up 2FA.
  @Post('2fa/setup')
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  setup2FA(@Body() body: ForgotPasswordBodyDTO) {
    return this.authService.forgotPassword(body);
  }
}

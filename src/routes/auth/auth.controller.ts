import { Controller, Post, Body, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { Auth } from 'src/shared/decorators/auth.decorator';
// import { AuthType, GuardCondition } from 'src/shared/constants/auth.constant';
import {
  LoginBodyDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  SendOTPBodyDTO,
} from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResDTO)
  async register(@Body() body: RegisterBodyDTO) {
    return await this.authService.register(body);
  }

  @Post('otp')
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body);
  }

  @Post('login')
  async login(
    @Body() body: LoginBodyDTO,
    @Ip() ip,
    @UserAgent() userAgent: string,
  ) {
    return await this.authService.login({
      ...body,
      ip,
      userAgent,
    });
  }

  // @Post('refresh-token')
  // @Auth([AuthType.Bearer, AuthType.APIKey], { condition: GuardCondition.And })
  // @HttpCode(HttpStatus.OK)
  // async refreshToken(@Body() body: any) {
  //   return await this.authService.refreshToken(body.refreshToken);
  // }

  // @Post('logout')
  // async logout(@Body() body: any) {
  //   return await this.authService.logout(body.refreshToken);
  // }
}

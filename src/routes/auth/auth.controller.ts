import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { AuthType, GuardCondition } from 'src/shared/constants/auth.constant';
import { RegisterBodyDto, RegisterResDTO } from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResDTO)
  async register(@Body() body: RegisterBodyDto) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return await this.authService.login(body);
  }

  @Post('refresh-token')
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: GuardCondition.And })
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: any) {
    return await this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: any) {
    return await this.authService.logout(body.refreshToken);
  }
}

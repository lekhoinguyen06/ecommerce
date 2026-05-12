import { Body, Controller, Get, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { ChangePasswordBodyDTO, UpdateProfileBodyDTO } from './profile.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  UpdateUserProfileResDTO,
  GetUserProfileResDTO,
} from 'src/shared/dto/shared-user.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ZodSerializerDto(GetUserProfileResDTO)
  getProfile(@ActiveUser('userId') userId: number) {
    return this.profileService.getProfile(userId);
  }

  @Put()
  @ZodSerializerDto(UpdateUserProfileResDTO)
  updateProfile(
    @ActiveUser('userId') userId: number,
    @Body() body: UpdateProfileBodyDTO,
  ) {
    return this.profileService.updateProfile({ userId, data: body });
  }

  @Put('change-password')
  @ZodSerializerDto(UpdateUserProfileResDTO)
  changePassword(
    @ActiveUser('userId') userId: number,
    @Body() body: ChangePasswordBodyDTO,
  ) {
    return this.profileService.changePassword({ userId, body });
  }
}

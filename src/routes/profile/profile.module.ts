import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfileRepository } from './profile.repo';

@Module({
  providers: [ProfileService, ProfileRepository],
  controllers: [ProfileController],
})
export class ProfileModule {}

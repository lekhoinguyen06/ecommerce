import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repo';
import { HashingService } from 'src/shared/services/hashing.service';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { ChangePasswordBodyType, UpdateMeBodyType } from './profile.model';
import {
  IncorrectPasswordException,
  NotFoundRecordException,
} from 'src/shared/error';
import {
  GetUserProfileResType,
  UpdateUserProfileResType,
} from 'src/shared/models/shared-user.model';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepo: ProfileRepository,
    private readonly hashingService: HashingService,
    private readonly sharedUserRepo: SharedUserRepository,
  ) {}

  async getProfile(userId: number): Promise<GetUserProfileResType> {
    const profile = await this.profileRepo.getProfile(userId);
    if (!profile) {
      throw NotFoundRecordException;
    }
    return profile;
  }

  async updateProfile({
    userId,
    data,
  }: {
    userId: number;
    data: Partial<UpdateMeBodyType>;
  }): Promise<UpdateUserProfileResType> {
    // Validate
    const user = await this.sharedUserRepo.findUnique({ id: userId });
    if (!user) {
      throw NotFoundRecordException;
    }

    // Update
    return this.sharedUserRepo.update({
      id: userId,
      data,
    });
  }

  async changePassword({
    userId,
    body,
  }: {
    userId: number;
    body: ChangePasswordBodyType;
  }): Promise<UpdateUserProfileResType> {
    // Validate
    const { password, newPassword } = body;
    const user = await this.sharedUserRepo.findUnique({ id: userId });
    if (!user) {
      throw NotFoundRecordException;
    }

    const isPasswordValid = await this.hashingService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw IncorrectPasswordException;
    }

    // Update
    const hashedPassword = await this.hashingService.hash(newPassword);
    return this.sharedUserRepo.update({
      id: userId,
      data: { password: hashedPassword },
    });
  }
}

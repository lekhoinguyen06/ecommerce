import { Injectable } from '@nestjs/common';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';

@Injectable()
export class ProfileRepository {
  constructor(private readonly sharedUserRepo: SharedUserRepository) {}

  getProfile(userId: number) {
    return this.sharedUserRepo.findUniqueWithRolePermissions({ id: userId });
  }
}

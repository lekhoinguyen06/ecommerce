import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repo';
import {
  CreateUserBodyType,
  CreateUserResType,
  GetUsersQueryType,
  GetUsersResType,
  UpdateUserBodyType,
  UpdateUserResType,
} from './user.model';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { NotFoundRecordException } from 'src/shared/error';
import {
  CannotModifySelfException,
  CannotSetAdminRoleToUserException,
  RoleNotFoundException,
  UserAlreadyExistsException,
} from './user.error';
import { RoleName } from 'src/shared/constants/role.constant';
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repo';
import { HashingService } from 'src/shared/services/hashing.service';
import {
  isUniqueConstraintPrisma2002Error,
  isForeignKeyConstraintPrisma2003Error,
  isRequiredRecordNotFoundPrisma2025Error,
} from 'src/types/helper';
import { GetUserProfileResType } from 'src/shared/models/shared-user.model';
import { MessageResType } from 'src/shared/models/response.model';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly sharedUserRepo: SharedUserRepository,
    private readonly sharedRoleRepo: SharedRoleRepository,
    private readonly hashingService: HashingService,
  ) {}

  /* Check user role
   * @param roleNameAgent The role name of the user performing the action
   * @param roleIdTarget The role ID of the target user
   * @throws ForbiddenException if the agent does not have permission to perform the action on the target user
   * @returns void
   *
   * RULE:
   * - Admin can perform create admin, create user, promote user to admin, and delete admin user
   * - Non admin cannot perform any action on any admin user
   */
  private async verifyRole({
    roleNameAgent,
    roleIdTarget,
  }: {
    roleNameAgent: string;
    roleIdTarget: number;
  }): Promise<boolean> {
    if (roleNameAgent === RoleName.Admin) {
      return true;
    } else {
      const adminId = await this.sharedRoleRepo.getAdminRoleId();
      if (roleIdTarget === adminId) {
        throw CannotSetAdminRoleToUserException;
      } else {
        return true;
      }
    }
  }

  private async getRoleIdByUserId(userId: number): Promise<number> {
    const user = await this.sharedUserRepo.findUnique({ id: userId });
    if (!user) {
      throw NotFoundRecordException;
    }
    return user.roleId;
  }

  private verifySelf({
    userAgentId,
    userTargetId,
  }: {
    userAgentId: number;
    userTargetId: number;
  }): void {
    if (userAgentId === userTargetId) {
      throw CannotModifySelfException;
    }
  }

  async list(pagination: GetUsersQueryType): Promise<GetUsersResType> {
    const result = await this.userRepo.list(pagination);
    return {
      data: result,
      totalItems: result.length,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(result.length / pagination.limit),
    };
  }

  async findById(userId: number): Promise<GetUserProfileResType> {
    const user = await this.sharedUserRepo.findUniqueWithRolePermissions({
      id: userId,
    });
    if (!user) {
      throw NotFoundRecordException;
    }
    return user;
  }

  async create({
    data,
    createdById,
    createdByRoleName,
  }: {
    data: CreateUserBodyType;
    createdById: number;
    createdByRoleName: string;
  }): Promise<CreateUserResType> {
    try {
      await this.verifyRole({
        roleNameAgent: createdByRoleName,
        roleIdTarget: data.roleId,
      });

      const hashedPassword = await this.hashingService.hash(data.password);

      const user = await this.userRepo.create({
        ...data,
        password: hashedPassword,
        createdById,
      });

      return user;
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw UserAlreadyExistsException;
      }
      if (isForeignKeyConstraintPrisma2003Error(error)) {
        throw RoleNotFoundException;
      }
      throw error;
    }
  }

  async update({
    userId,
    data,
    updatedById,
    updatedByRoleName,
  }: {
    userId: number;
    data: UpdateUserBodyType;
    updatedById: number;
    updatedByRoleName: string;
  }): Promise<UpdateUserResType> {
    try {
      this.verifySelf({ userAgentId: updatedById, userTargetId: userId });

      const roleId = await this.getRoleIdByUserId(userId);
      await this.verifyRole({
        roleNameAgent: updatedByRoleName,
        roleIdTarget: roleId,
      });

      const updatedUser = await this.sharedUserRepo.update({
        id: userId,
        data: {
          ...data,
          updatedById,
        },
      });
      return updatedUser;
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw UserAlreadyExistsException;
      }
      if (isForeignKeyConstraintPrisma2003Error(error)) {
        throw RoleNotFoundException;
      }
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async delete({
    userId,
    deletedByRoleName,
    deletedById,
  }: {
    userId: number;
    deletedByRoleName: string;
    deletedById: number;
  }): Promise<MessageResType> {
    try {
      this.verifySelf({ userAgentId: deletedById, userTargetId: userId });

      const roleId = await this.getRoleIdByUserId(userId);
      await this.verifyRole({
        roleNameAgent: deletedByRoleName,
        roleIdTarget: roleId,
      });

      await this.userRepo.delete({ userId, deletedById });
      return {
        message: `User ${userId} deleted successfully by ${deletedByRoleName} ${deletedById}`,
      };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async restore({
    userId,
    restoredById,
    restoredByRoleName,
  }: {
    userId: number;
    restoredById: number;
    restoredByRoleName: string;
  }): Promise<MessageResType> {
    try {
      this.verifySelf({ userAgentId: restoredById, userTargetId: userId });

      const roleId = await this.getRoleIdByUserId(userId);
      await this.verifyRole({
        roleNameAgent: restoredByRoleName,
        roleIdTarget: roleId,
      });

      await this.sharedUserRepo.update({
        id: userId,
        data: {
          deletedAt: null,
          updatedById: restoredById,
        },
      });
      return {
        message: `User ${userId} restored successfully by ${restoredByRoleName} ${restoredById}`,
      };
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw UserAlreadyExistsException;
      }
      if (isForeignKeyConstraintPrisma2003Error(error)) {
        throw RoleNotFoundException;
      }
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}

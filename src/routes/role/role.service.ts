// Role service
import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repo';
import {
  CreateRoleType,
  GetRoleDetailResType,
  GetRolesResType,
  UpdateRoleType,
} from './role.model';
import {
  isRequiredRecordNotFoundPrisma2025Error,
  isUniqueConstraintPrisma2002Error,
} from 'src/types/helper';
import {
  ProhibitActionOnBaseRoleException,
  RoleAlreadyExistsException,
} from './role.error';
import { NotFoundRecordException } from 'src/shared/error';
import { MessageResType } from 'src/shared/models/response.model';
import {
  baseRoles,
  RoleName,
  RoleNameType,
} from 'src/shared/constants/role.constant';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create({
    data,
    createdById,
  }: {
    data: CreateRoleType;
    createdById: number;
  }): Promise<GetRoleDetailResType> {
    try {
      // Check if permissions are soft-deleted
      const validatedPermissionIds =
        await this.roleRepository.validatePermissionIds(
          data.permissionIds || [],
        );
      if (validatedPermissionIds !== (data.permissionIds?.length || 0)) {
        throw NotFoundRecordException;
      }
      const role = await this.roleRepository.create({ data, createdById });
      return {
        ...role,
        // Mapping relations
        permissions: role.permissions?.map((item) => item.permission) || [],
      };
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw RoleAlreadyExistsException;
      }
      throw error;
    }
  }

  async paginate(page: number, limit: number): Promise<GetRolesResType> {
    try {
      const result = await this.roleRepository.paginate(page, limit);
      return {
        data: result.map((role) => ({
          ...role,
          // Mapping relations
          permissions: role.permissions?.map((item) => item.permission) || [],
        })),
        itemsCount: result.length,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<GetRoleDetailResType> {
    try {
      const result = await this.roleRepository.findOne(id);

      if (!result) {
        throw NotFoundRecordException;
      }

      return {
        ...result,
        // Mapping relations
        permissions: result.permissions?.map((item) => item.permission) || [],
      };
    } catch (error) {
      throw error;
    }
  }

  async update({
    id,
    data,
    updatedById,
  }: {
    id: number;
    data: UpdateRoleType;
    updatedById: number;
  }): Promise<GetRoleDetailResType> {
    try {
      // Base roles check (ADMIN role cannot be updated by anyone)
      const base = await this.roleRepository.findOne(id);
      if (!base) {
        throw NotFoundRecordException;
      }
      if (base.name === RoleName.Admin) {
        throw ProhibitActionOnBaseRoleException;
      }

      // Check if permissions are soft-deleted
      const validatedPermissionIds =
        await this.roleRepository.validatePermissionIds(
          data.permissionIds || [],
        );
      if (validatedPermissionIds !== (data.permissionIds?.length || 0)) {
        throw NotFoundRecordException;
      }
      const role = await this.roleRepository.update({ id, data, updatedById });
      return {
        ...role,
        // Mapping relations
        permissions: role.permissions?.map((item) => item.permission) || [],
      };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw RoleAlreadyExistsException;
      }
      throw error;
    }
  }

  async delete(
    id: number,
    deletedById: number,
    isHard = false,
  ): Promise<MessageResType> {
    try {
      // Base roles check (base role cannot be deleted by anyone)
      const role = await this.roleRepository.findOne(id);
      if (!role) {
        throw NotFoundRecordException;
      }
      if (baseRoles.has(role.name as RoleNameType)) {
        throw ProhibitActionOnBaseRoleException;
      }
      await this.roleRepository.delete({ id, deletedById }, isHard);
      return { message: 'Role deleted successfully' };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async restore(id: number, restoredById: number): Promise<MessageResType> {
    try {
      await this.roleRepository.restore({ id, restoredById });
      return { message: 'Role restored successfully' };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}

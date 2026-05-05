// Role service
import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repo';
import {
  CreateRoleType,
  GetRoleDetailResType,
  GetRolesResType,
  UpdateRoleType,
} from './role.model';
import { isUniqueConstraintPrisma2002Error } from 'src/types/helper';
import { RoleAlreadyExistsError } from './role.error';
import { NotFoundRecord } from 'src/shared/error';
import { MessageResType } from 'src/shared/models/response.model';

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
      const role = await this.roleRepository.create({ data, createdById });
      return {
        ...role,
        // Mapping relations
        permissions: role.permissions?.map((item) => item.permission) || [],
      };
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw RoleAlreadyExistsError;
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
        throw NotFoundRecord;
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
      const role = await this.roleRepository.update({ id, data, updatedById });
      return {
        ...role,
        // Mapping relations
        permissions: role.permissions?.map((item) => item.permission) || [],
      };
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw RoleAlreadyExistsError;
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
      await this.roleRepository.delete({ id, deletedById }, isHard);
      return { message: 'Role deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async restore(id: number, restoredById: number): Promise<MessageResType> {
    try {
      await this.roleRepository.restore({ id, restoredById });
      return { message: 'Role restored successfully' };
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw RoleAlreadyExistsError;
      }
      throw error;
    }
  }
}

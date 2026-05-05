import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './permission.repo';
import { NotFoundRecordException } from 'src/shared/error';
import {
  CreatePermissionBodyType,
  GetPermissionDetailResType,
  GetPermissionResType,
  GetPermissionsQueryType,
  UpdatePermissionBodyType,
} from './permission.model';
import {
  isRequiredRecordNotFoundPrisma2025Error,
  isUniqueConstraintPrisma2002Error,
} from 'src/types/helper';
import { PermissionAlreadyExistsException } from './permission.error';
import { MessageResType } from 'src/shared/models/response.model';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async findOne(id: number): Promise<GetPermissionDetailResType> {
    const data = await this.permissionRepository.findOne(id);

    if (!data) throw NotFoundRecordException;

    return data;
  }

  async paginate(
    query: GetPermissionsQueryType,
  ): Promise<GetPermissionResType> {
    const data = await this.permissionRepository.paginate(
      query.page,
      query.limit,
    );

    if (!data.length) throw NotFoundRecordException;

    return {
      data,
      limit: query.limit,
      totalItems: data.length,
      totalPages: Math.ceil(data.length / query.limit),
      currentPage: query.page,
    };
  }

  async create({
    data,
    createdById,
  }: {
    data: CreatePermissionBodyType;
    createdById: number;
  }): Promise<GetPermissionDetailResType> {
    try {
      return await this.permissionRepository.create(data, createdById);
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw PermissionAlreadyExistsException;
      }
      throw error;
    }
  }

  async update({
    id,
    data,
    updatedById,
  }: {
    id: number;
    data: UpdatePermissionBodyType;
    updatedById: number;
  }): Promise<GetPermissionDetailResType> {
    try {
      return await this.permissionRepository.update(id, data, updatedById);
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw PermissionAlreadyExistsException;
      }
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async delete({
    id,
    deletedById,
  }: {
    id: number;
    deletedById: number;
  }): Promise<MessageResType> {
    try {
      await this.permissionRepository.delete({
        id,
        deletedById,
      });
      return {
        message: 'Permission deleted successfully',
      };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async restore({
    id,
    restoredById,
  }: {
    id: number;
    restoredById: number;
  }): Promise<MessageResType> {
    try {
      await this.permissionRepository.restore({
        id,
        restoredById,
      });
      return {
        message: 'Permission restored successfully',
      };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}

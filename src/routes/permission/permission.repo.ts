import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CreatePermissionBodyType,
  UpdatePermissionBodyType,
} from './permission.model';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: number) {
    return this.prisma.permission.findUnique({
      where: { id, deletedAt: null },
    });
  }

  paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.prisma.permission.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
    });
  }

  create(data: CreatePermissionBodyType, createdById: number) {
    return this.prisma.permission.create({
      data: { ...data, createdById },
    });
  }

  update(id: number, data: UpdatePermissionBodyType, updatedById: number) {
    return this.prisma.permission.update({
      where: { id, deletedAt: null },
      data: { ...data, updatedById },
    });
  }

  delete(
    { id, deletedById }: { id: number; deletedById: number },
    isHardDelete = false,
  ) {
    if (isHardDelete) {
      return this.prisma.permission.delete({
        where: { id },
      });
    } else {
      return this.prisma.permission.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date(), deletedById },
      });
    }
  }

  restore({ id, restoredById }: { id: number; restoredById: number }) {
    return this.prisma.permission.update({
      where: { id, deletedAt: { not: null } },
      data: { deletedAt: null, updatedById: restoredById },
    });
  }
}

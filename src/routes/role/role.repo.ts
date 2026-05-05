import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateRoleType, UpdateRoleType } from './role.model';

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create({ data, createdById }: { data: CreateRoleType; createdById: number }) {
    return this.prismaService.role.create({
      data: {
        ...data,
        createdById,
      },
    });
  }

  paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.prismaService.role.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
    });
  }

  findOne(roleId: number) {
    return this.prismaService.role.findFirst({
      where: {
        id: roleId,
        deletedAt: null,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  update({
    id,
    data,
    updatedById,
  }: {
    id: number;
    data: UpdateRoleType;
    updatedById: number;
  }) {
    return this.prismaService.role.update({
      where: { id },
      data: {
        ...data,
        updatedById,
        permissions: {
          set:
            data.permissionIds?.map((permissionId) => ({
              permission_id_role_id: {
                permission_id: permissionId,
                role_id: id,
              },
            })) || [],
        },
      },
    });
  }

  delete(
    { id, deletedById }: { id: number; deletedById: number },
    isHard?: boolean,
  ) {
    if (isHard) {
      return this.prismaService.role.delete({
        where: { id },
      });
    } else {
      return this.prismaService.role.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedById: deletedById,
        },
      });
    }
  }

  restore({ id, restoredById }: { id: number; restoredById: number }) {
    return this.prismaService.role.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedById: null,
        updatedById: restoredById,
      },
    });
  }
}

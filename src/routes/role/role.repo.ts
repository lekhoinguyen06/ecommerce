import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateRoleType, UpdateRoleType } from './role.model';

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  validatePermissionIds(permissionIds: number[]) {
    return this.prismaService.permission.count({
      where: {
        id: { in: permissionIds },
        deletedAt: null,
      },
    });
  }

  create({ data, createdById }: { data: CreateRoleType; createdById: number }) {
    const { permissionIds, ...rest } = data;
    return this.prismaService.role.create({
      data: {
        ...rest,
        createdById,
        permissions: {
          create: permissionIds?.map((permissionId) => ({
            permission: {
              connect: { id: permissionId },
            },
          })),
        },
      },
      include: {
        permissions: {
          where: {
            permission: {
              deletedAt: null,
            },
          },
          include: {
            permission: true,
          },
        },
      },
    });
  }

  paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.prismaService.role.findMany({
      where: { deletedAt: null },
      include: {
        permissions: {
          where: {
            permission: {
              deletedAt: null,
            },
          },
          include: {
            permission: true,
          },
        },
      },
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
          where: {
            permission: {
              deletedAt: null,
            },
          },
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
    const { permissionIds, ...rest } = data;

    return this.prismaService.role.update({
      where: { id },
      data: {
        ...rest,
        updatedById,
        permissions: {
          deleteMany: {}, // Delete all existing relations
          create: permissionIds?.map((permissionId) => ({
            permission: {
              connect: { id: permissionId },
            },
          })),
        },
      },
      include: {
        permissions: {
          where: {
            permission: {
              deletedAt: null,
            },
          },
          include: {
            permission: true,
          },
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

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UserType } from '../models/shared-user.model';
import { PermissionType } from '../models/shared-permission.model';
import { RoleType } from '../models/shared-role.model';

export type UniqueUserObject = { email: string } | { id: number };

type UserWithRolePermissions = UserType & {
  role: RoleType & {
    permissions: PermissionType[];
  };
};

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(uniqueObject: UniqueUserObject): Promise<UserType | null> {
    return this.prismaService.user.findFirst({
      where: { ...uniqueObject, deletedAt: null },
    });
  }

  async findUniqueWithRolePermissions(
    uniqueObject: UniqueUserObject,
  ): Promise<UserWithRolePermissions | null> {
    const user = await this.prismaService.user.findFirst({
      where: { ...uniqueObject, deletedAt: null },
      include: {
        role: {
          include: {
            permissions: {
              where: {
                permission: {
                  deletedAt: null,
                },
              },
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      role: {
        ...user.role,
        permissions: user.role.permissions.map((p) => p.permission),
      },
    };
  }

  async update({ id, data }: { id: number; data: Partial<UserType> }) {
    return this.prismaService.user.update({
      where: { id, deletedAt: null },
      data,
    });
  }
}

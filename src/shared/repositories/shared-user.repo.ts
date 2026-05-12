import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UserType } from '../models/shared-user.model';
import { PermissionType } from '../models/shared-permission.model';
import { RoleType } from '../models/shared-role.model';

type UniqueObject = { email: string } | { id: number };

type UserWithRolePermissions = UserType & {
  role: RoleType & {
    permissions: PermissionType[];
  };
};

@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(uniqueObject: UniqueObject): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
    });
  }

  async findUniqueWithRolePermissions(
    uniqueObject: UniqueObject,
  ): Promise<UserWithRolePermissions | null> {
    const user = await this.prismaService.user.findUnique({
      where: uniqueObject,
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
}

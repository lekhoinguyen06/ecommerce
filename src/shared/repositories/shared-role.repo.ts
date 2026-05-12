import { Injectable } from '@nestjs/common';
import { RoleName, RoleNameType } from 'src/shared/constants/role.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class SharedRoleRepository {
  private clientRoleId: number | null = null;
  private adminRoleId: number | null = null;

  constructor(private readonly prismaService: PrismaService) {}

  private async getRole(roleName: RoleNameType) {
    const role = await this.prismaService.role.findFirstOrThrow({
      where: {
        name: roleName,
        deletedAt: null,
      },
    });
    return role;
  }

  async getClientRoleId() {
    if (this.clientRoleId) return this.clientRoleId;

    const role = await this.getRole(RoleName.Client);
    this.clientRoleId = role.id;
    return this.clientRoleId;
  }

  async getAdminRoleId() {
    if (this.adminRoleId) return this.adminRoleId;

    const role = await this.getRole(RoleName.Admin);
    this.adminRoleId = role.id;
    return this.adminRoleId;
  }
}

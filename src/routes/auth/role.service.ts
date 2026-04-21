import { Injectable } from '@nestjs/common';
import { RoleName } from 'src/shared/constants/role.constant';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class RoleService {
  private clientRoleId: number | null = null;

  constructor(private readonly prismaService: PrismaService) {}

  async getClientRoleId() {
    if (this.clientRoleId) return this.clientRoleId;
    const role = await this.prismaService.role.findFirst({
      where: {
        name: RoleName.Client,
        deletedAt: null,
      },
    });

    if (!role) {
      throw new Error(`Role with name ${RoleName.Client} not found`);
    }

    this.clientRoleId = role.id;
    return this.clientRoleId;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateUserBodyType, GetUsersQueryType } from './user.model';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';

@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sharedUserRepo: SharedUserRepository,
  ) {}

  list(pagination: GetUsersQueryType) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    return this.prisma.user.findMany({
      skip: offset,
      take: limit,
      where: { deletedAt: null },
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  create(data: CreateUserBodyType & { createdById: number }) {
    return this.prisma.user.create({
      data,
    });
  }

  delete({ userId, deletedById }: { userId: number; deletedById: number }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), deletedById },
    });
  }

  restore({ userId, restoredById }: { userId: number; restoredById: number }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: null, updatedById: restoredById },
    });
  }
}

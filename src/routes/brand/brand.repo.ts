import { Injectable } from '@nestjs/common';
import { PaginationQueryBodyType } from 'src/shared/models/request.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  BrandWithTranslationsType,
  CreateBrandBodyType,
  GetBrandsResType,
  UpdateBrandBodyType,
} from './brand.model';

@Injectable()
export class BrandRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async paginate({
    page,
    limit,
    languageId,
  }: PaginationQueryBodyType & {
    languageId?: string;
  }): Promise<GetBrandsResType> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.prismaService.brand.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        include: {
          translations: {
            where: languageId
              ? { languageId, deletedAt: null }
              : { deletedAt: null },
          },
        },
      }),
      this.prismaService.brand.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      limit,
    };
  }

  create({
    name,
    logo,
    createdById,
  }: CreateBrandBodyType & { createdById?: number }) {
    return this.prismaService.brand.create({
      data: {
        name,
        logo,
        createdById: createdById ?? undefined,
      },
    });
  }

  findById(
    id: number,
    languageId?: string,
  ): Promise<BrandWithTranslationsType | null> {
    return this.prismaService.brand.findUnique({
      where: { id, deletedAt: null },
      include: {
        translations: {
          where: languageId
            ? { languageId, deletedAt: null }
            : { deletedAt: null },
        },
      },
    });
  }

  update({
    name,
    logo,
    id,
    updatedById,
  }: UpdateBrandBodyType & { id: number; updatedById?: number }) {
    return this.prismaService.brand.update({
      where: { id, deletedAt: null },
      data: {
        name,
        logo,
        updatedById: updatedById ?? undefined,
      },
    });
  }

  delete(
    { id, deletedById }: { id: number; deletedById?: number },
    isHard?: boolean,
  ) {
    if (isHard) {
      return this.prismaService.brand.delete({
        where: { id },
      });
    } else {
      return this.prismaService.brand.update({
        where: { id, deletedAt: null },
        data: {
          deletedAt: new Date(),
          deletedById: deletedById ?? undefined,
        },
      });
    }
  }
}

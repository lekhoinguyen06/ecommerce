import { Injectable } from '@nestjs/common';
import { PaginationQueryBodyType } from 'src/shared/models/request.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  FullCategoryType,
  CreateCategoryBodyType,
  GetCategoriesResType,
  UpdateCategoryBodyType,
} from './category.model';
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/language.const';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async paginate({
    page,
    limit,
    languageId,
  }: PaginationQueryBodyType & {
    languageId: string;
  }): Promise<GetCategoriesResType> {
    console.log('languageId', languageId);
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.prismaService.category.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        include: {
          translations: {
            where:
              languageId === ALL_LANGUAGE_CODE
                ? { deletedAt: null }
                : { languageId, deletedAt: null },
          },
        },
      }),
      this.prismaService.category.count({
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
    createdById,
  }: CreateCategoryBodyType & { createdById: number }) {
    return this.prismaService.category.create({
      data: {
        name,
        createdById: createdById ?? undefined,
      },
    });
  }

  findById(id: number, languageId?: string): Promise<FullCategoryType | null> {
    return this.prismaService.category.findUnique({
      where: { id, deletedAt: null },
      include: {
        subCategories: {
          where: { deletedAt: null },
        },
        translations: {
          where:
            languageId === ALL_LANGUAGE_CODE
              ? { deletedAt: null }
              : { languageId, deletedAt: null },
        },
      },
    });
  }

  update({
    data,
    id,
    updatedById,
  }: {
    data: UpdateCategoryBodyType;
    id: number;
    updatedById?: number;
  }) {
    return this.prismaService.category.update({
      where: { id, deletedAt: null },
      data: {
        ...data,
        updatedById: updatedById ?? undefined,
      },
    });
  }

  delete(
    { id, deletedById }: { id: number; deletedById?: number },
    isHard?: boolean,
  ) {
    if (isHard) {
      return this.prismaService.category.delete({
        where: { id },
      });
    } else {
      return this.prismaService.category.update({
        where: { id, deletedAt: null },
        data: {
          deletedAt: new Date(),
          deletedById: deletedById ?? undefined,
        },
      });
    }
  }
}

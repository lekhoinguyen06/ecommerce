import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CategoryTranslationType,
  CreateCategoryTranslationBodyType,
  UpdateCategoryTranslationBodyType,
} from './category-translation.model';

@Injectable()
export class CategoryTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create({
    categoryId,
    languageId,
    name,
    description,
    createdById,
  }: CreateCategoryTranslationBodyType & { createdById?: number }) {
    return this.prismaService.categoryTranslation.create({
      data: {
        categoryId,
        languageId,
        name,
        description,
        createdById,
      },
    });
  }

  findById(id: number): Promise<CategoryTranslationType | null> {
    return this.prismaService.categoryTranslation.findUnique({
      where: { id, deletedAt: null },
    });
  }

  update({
    id,
    data,
    updatedById,
  }: {
    id: number;
    data: UpdateCategoryTranslationBodyType;
    updatedById?: number;
  }): Promise<CategoryTranslationType> {
    return this.prismaService.categoryTranslation.update({
      where: { id, deletedAt: null },
      data: {
        ...data,
        updatedById,
      },
    });
  }

  delete(
    { id, deletedById }: { id: number; deletedById?: number },
    isHard?: boolean,
  ): Promise<CategoryTranslationType> {
    if (isHard) {
      return this.prismaService.categoryTranslation.delete({
        where: { id },
      });
    }
    return this.prismaService.categoryTranslation.update({
      where: { id, deletedAt: null },
      data: {
        deletedById,
        deletedAt: new Date(),
      },
    });
  }
}

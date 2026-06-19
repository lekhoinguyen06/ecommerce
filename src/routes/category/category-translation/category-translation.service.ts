import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CategoryTranslationRepository } from './category-translation.repo';
import {
  CategoryTranslationType,
  CreateCategoryTranslationBodyType,
  UpdateCategoryTranslationBodyType,
} from './category-translation.model';
import { NotFoundRecordException } from 'src/shared/error';
import {
  isForeignKeyConstraintPrisma2003Error,
  isRequiredRecordNotFoundPrisma2025Error,
  isUniqueConstraintPrisma2002Error,
} from 'src/types/helper';
import { MessageResType } from 'src/shared/models/response.model';

@Injectable()
export class CategoryTranslationService {
  constructor(
    private readonly categoryTranslationRepo: CategoryTranslationRepository,
  ) {}

  async create(
    body: CreateCategoryTranslationBodyType & { createdById?: number },
  ): Promise<CategoryTranslationType> {
    try {
      return await this.categoryTranslationRepo.create(body);
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw new UnprocessableEntityException();
      }
      if (isForeignKeyConstraintPrisma2003Error(error)) {
        throw new UnprocessableEntityException([
          {
            message: 'Invalid foreign key reference.',
            path: 'categoryId',
          },
          {
            message: 'Invalid foreign key reference.',
            path: 'languageId',
          },
        ]);
      }
      throw error;
    }
  }

  async findById(id: number): Promise<CategoryTranslationType> {
    try {
      const categoryTranslation =
        await this.categoryTranslationRepo.findById(id);
      if (!categoryTranslation) {
        throw NotFoundRecordException;
      }
      return categoryTranslation;
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async update(body: {
    data: UpdateCategoryTranslationBodyType;
    id: number;
    updatedById?: number;
  }): Promise<CategoryTranslationType> {
    try {
      return await this.categoryTranslationRepo.update(body);
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw new UnprocessableEntityException([
          {
            message: 'A category translation already exists.',
            path: 'categoryId',
          },
          {
            message: 'A category translation already exists.',
            path: 'languageId',
          },
        ]);
      }
      throw error;
    }
  }

  async delete({
    id,
    deletedById,
  }: {
    id: number;
    deletedById?: number;
  }): Promise<MessageResType> {
    try {
      await this.categoryTranslationRepo.delete({ id, deletedById });
      return { message: 'Category translation deleted successfully' };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}

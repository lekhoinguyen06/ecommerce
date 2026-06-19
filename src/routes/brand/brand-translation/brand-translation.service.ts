import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BrandTranslationRepository } from './brand-translation.repo';
import {
  BrandTranslationType,
  CreateBrandTranslationBodyType,
  UpdateBrandTranslationBodyType,
} from './brand-translation.model';
import { NotFoundRecordException } from 'src/shared/error';
import {
  isForeignKeyConstraintPrisma2003Error,
  isRequiredRecordNotFoundPrisma2025Error,
  isUniqueConstraintPrisma2002Error,
} from 'src/types/helper';
import { MessageResType } from 'src/shared/models/response.model';

@Injectable()
export class BrandTranslationService {
  constructor(
    private readonly brandTranslationRepo: BrandTranslationRepository,
  ) {}

  async create(
    body: CreateBrandTranslationBodyType & { createdById?: number },
  ): Promise<BrandTranslationType> {
    try {
      return await this.brandTranslationRepo.create(body);
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw new UnprocessableEntityException();
      }
      if (isForeignKeyConstraintPrisma2003Error(error)) {
        throw new UnprocessableEntityException([
          {
            message: 'Invalid foreign key reference.',
            path: 'brandId',
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

  async findById(id: number): Promise<BrandTranslationType> {
    try {
      const brandTranslation = await this.brandTranslationRepo.findById(id);
      if (!brandTranslation) {
        throw NotFoundRecordException;
      }
      return brandTranslation;
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async update(body: {
    data: UpdateBrandTranslationBodyType;
    id: number;
    updatedById?: number;
  }): Promise<BrandTranslationType> {
    try {
      return await this.brandTranslationRepo.update(body);
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw new UnprocessableEntityException([
          {
            message: 'A brand translation already exists.',
            path: 'brandId',
          },
          {
            message: 'A brand translation already exists.',
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
      await this.brandTranslationRepo.delete({ id, deletedById });
      return { message: 'Brand translation deleted successfully' };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}

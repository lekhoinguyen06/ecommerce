import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BrandTranslationRepository } from './brand-translation.repo';
import {
  BrandTranslationType,
  CreateBrandTranslationBodyType,
  UpdateBrandTranslationBodyType,
} from './brand-translation.model';
import { NotFoundRecordException } from 'src/shared/error';
import {
  isRequiredRecordNotFoundPrisma2025Error,
  isUniqueConstraintPrisma2002Error,
} from 'src/types/helper';
import { MessageResType } from 'src/shared/models/response.model';

@Injectable()
export class BrandTranslationService {
  constructor(
    private readonly brandTranslationRepo: BrandTranslationRepository,
  ) {}

  create(
    body: CreateBrandTranslationBodyType & { createdById?: number },
  ): Promise<BrandTranslationType> {
    return this.brandTranslationRepo.create(body);
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

  update(body: {
    data: UpdateBrandTranslationBodyType;
    id: number;
    updatedById?: number;
  }): Promise<BrandTranslationType> {
    try {
      return this.brandTranslationRepo.update(body);
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw new UnprocessableEntityException();
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
        return { message: 'Brand translation not found' };
      }
      throw error;
    }
  }
}

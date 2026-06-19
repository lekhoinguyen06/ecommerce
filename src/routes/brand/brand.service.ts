import { Injectable } from '@nestjs/common';
import { BrandRepository } from './brand.repo';
import { PaginationQueryBodyType } from 'src/shared/models/request.model';
import {
  BrandType,
  BrandWithTranslationsType,
  CreateBrandBodyType,
  GetBrandsResType,
  UpdateBrandBodyType,
} from './brand.model';
import { MessageResType } from 'src/shared/models/response.model';
import { isRequiredRecordNotFoundPrisma2025Error } from 'src/types/helper';
import { NotFoundRecordException } from 'src/shared/error';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  list(
    body: PaginationQueryBodyType & { languageId?: string },
  ): Promise<GetBrandsResType> {
    try {
      return this.brandRepository.paginate(body);
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  create(
    body: CreateBrandBodyType & { createdById: number },
  ): Promise<BrandType> {
    return this.brandRepository.create(body);
  }

  async findById(id: number): Promise<BrandWithTranslationsType> {
    try {
      const brand = await this.brandRepository.findById(id);
      if (!brand) {
        throw NotFoundRecordException;
      }
      return brand;
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async update(body: {
    data: UpdateBrandBodyType;
    id: number;
    updatedById?: number;
  }): Promise<BrandType> {
    try {
      return await this.brandRepository.update(body);
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async delete(id: number, deletedById?: number): Promise<MessageResType> {
    try {
      await this.brandRepository.delete({ id, deletedById });
      return { message: 'Brand deleted successfully' };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}

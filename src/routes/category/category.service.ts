import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repo';
import { PaginationQueryBodyType } from 'src/shared/models/request.model';
import {
  CategoryType,
  FullCategoryType,
  CreateCategoryBodyType,
  GetCategoriesResType,
  UpdateCategoryBodyType,
} from './category.model';
import { MessageResType } from 'src/shared/models/response.model';
import { isRequiredRecordNotFoundPrisma2025Error } from 'src/types/helper';
import { NotFoundRecordException } from 'src/shared/error';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { FALLBACK_LANGUAGE_CODE } from 'src/shared/constants/language.const';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  list(
    body: PaginationQueryBodyType & { languageId?: string },
  ): Promise<GetCategoriesResType> {
    try {
      // console.log(
      //   this.i18n.t('error.NOT_FOUND', { lang: I18nContext.current()?.lang }),
      // );
      return this.categoryRepository.paginate({
        ...body,
        languageId: I18nContext.current()?.lang ?? FALLBACK_LANGUAGE_CODE,
      });
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  create(
    body: CreateCategoryBodyType & { createdById: number },
  ): Promise<CategoryType> {
    return this.categoryRepository.create(body);
  }

  async findById(id: number): Promise<FullCategoryType> {
    try {
      const category = await this.categoryRepository.findById(
        id,
        I18nContext.current()?.lang ?? FALLBACK_LANGUAGE_CODE,
      );
      if (!category) {
        throw NotFoundRecordException;
      }
      return category;
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async update(body: {
    data: UpdateCategoryBodyType;
    id: number;
    updatedById?: number;
  }): Promise<CategoryType> {
    try {
      return await this.categoryRepository.update(body);
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async delete(id: number, deletedById?: number): Promise<MessageResType> {
    try {
      await this.categoryRepository.delete({ id, deletedById });
      return { message: 'Category deleted successfully' };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}

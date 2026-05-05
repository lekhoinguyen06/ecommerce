import { Injectable } from '@nestjs/common';
import {
  CreateLanguageType,
  GetLanguageDetailResType,
  GetLanguagesResType,
} from './language.model';
import { LanguageRepository } from './language.repo';
import { UpdateLanguageDTO } from './language.dto';
import {
  isRequiredRecordNotFoundPrisma2025Error,
  isUniqueConstraintPrisma2002Error,
} from 'src/types/helper';
import { LanguageAlreadyExistsException } from './language.error';
import { MessageResType } from 'src/shared/models/response.model';
import { NotFoundRecordException } from 'src/shared/error';

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepository: LanguageRepository) {}
  async create(
    body: CreateLanguageType,
    userId: number,
  ): Promise<GetLanguageDetailResType> {
    try {
      return await this.languageRepository.create({
        data: body,
        userId,
      });
    } catch (error) {
      if (isUniqueConstraintPrisma2002Error(error)) {
        throw LanguageAlreadyExistsException;
      }
      throw error;
    }
  }

  async findAll(): Promise<GetLanguagesResType | null> {
    const languages = await this.languageRepository.findAll();
    if (!languages) {
      throw NotFoundRecordException;
    }
    return {
      data: languages,
      itemsCount: languages.length,
    };
  }

  async findOne(id: string): Promise<GetLanguageDetailResType | null> {
    const language = await this.languageRepository.findOne(id);
    if (!language) {
      throw NotFoundRecordException;
    }
    return language;
  }

  async update(
    data: UpdateLanguageDTO,
    userId: number,
  ): Promise<GetLanguageDetailResType> {
    try {
      return await this.languageRepository.update({
        data,
        userId,
      });
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async restore(id: string, userId: number): Promise<GetLanguageDetailResType> {
    try {
      return await this.languageRepository.restore({
        id,
        userId,
      });
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async delete(id: string, userId: number): Promise<MessageResType> {
    try {
      await this.languageRepository.delete({
        id,
        userId,
      });

      return {
        message: 'Language deleted successfully',
      };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }

  async remove(id: string): Promise<MessageResType> {
    try {
      await this.languageRepository.hardDelete(id);
      return {
        message: 'Language removed successfully',
      };
    } catch (error) {
      if (isRequiredRecordNotFoundPrisma2025Error(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CreateLanguageType, LanguageType } from './language.model';
import { LanguageRepository } from './language.repo';
import { UpdateLanguageDTO } from './language.dto';

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepository: LanguageRepository) {}
  async create(
    body: CreateLanguageType,
    userId: number,
  ): Promise<LanguageType> {
    return this.languageRepository.create({
      data: body,
      userId,
    });
  }

  findAll(): Promise<LanguageType[]> {
    return this.languageRepository.findAll();
  }

  findOne(id: string): Promise<LanguageType | null> {
    return this.languageRepository.findOne(id);
  }

  update(data: UpdateLanguageDTO, userId: number): Promise<LanguageType> {
    return this.languageRepository.update({
      data,
      userId,
    });
  }

  delete(id: string, userId: number): Promise<LanguageType> {
    return this.languageRepository.delete({
      id,
      userId,
    });
  }

  remove(id: string): Promise<LanguageType> {
    return this.languageRepository.hardDelete(id);
  }
}

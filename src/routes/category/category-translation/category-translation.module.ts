import { Module } from '@nestjs/common';
import { CategoryTranslationRepository } from './category-translation.repo';
import { CategoryTranslationService } from './category-translation.service';
import { CategoryTranslationController } from './category-translation.controller';

@Module({
  controllers: [CategoryTranslationController],
  providers: [CategoryTranslationService, CategoryTranslationRepository],
})
export class CategoryTranslationModule {}

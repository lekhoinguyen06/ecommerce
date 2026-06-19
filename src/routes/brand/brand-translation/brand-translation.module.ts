import { Module } from '@nestjs/common';
import { BrandTranslationRepository } from './brand-translation.repo';
import { BrandTranslationService } from './brand-translation.service';
import { BrandTranslationController } from './brand-translation.controller';

@Module({
  controllers: [BrandTranslationController],
  providers: [BrandTranslationService, BrandTranslationRepository],
})
export class BrandTranslationModule {}

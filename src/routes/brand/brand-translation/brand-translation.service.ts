import { Injectable } from '@nestjs/common';
import { BrandTranslationRepository } from './brand-translation.repo';

@Injectable()
export class BrandTranslationService {
  constructor(
    private readonly brandTranslationRepo: BrandTranslationRepository,
  ) {}
}

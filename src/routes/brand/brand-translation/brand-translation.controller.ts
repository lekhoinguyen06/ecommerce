import { Controller } from '@nestjs/common';
import { BrandTranslationService } from './brand-translation.service';

@Controller('brand-translation')
export class BrandTranslationController {
  constructor(
    private readonly brandTranslationService: BrandTranslationService,
  ) {}
}

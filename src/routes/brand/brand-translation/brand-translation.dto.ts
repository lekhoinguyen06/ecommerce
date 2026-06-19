import { createZodDto } from 'nestjs-zod';
import {
  BrandTranslationCreateBodySchema,
  BrandTranslationDetailResSchema,
  BrandTranslationUpdateBodySchema,
} from './brand-translation.model';

export class BrandTranslationCreateBodyDTO extends createZodDto(
  BrandTranslationCreateBodySchema,
) {}
export class BrandTranslationUpdateBodyDTO extends createZodDto(
  BrandTranslationUpdateBodySchema,
) {}
export class BrandTranslationDetailResDTO extends createZodDto(
  BrandTranslationDetailResSchema,
) {}

import { createZodDto } from 'nestjs-zod';
import {
  CreateBrandTranslationBodySchema,
  GetBrandTranslationDetailResSchema,
  UpdateBrandTranslationBodySchema,
} from './brand-translation.model';

export class CreateBrandTranslationBodyDTO extends createZodDto(
  CreateBrandTranslationBodySchema,
) {}
export class UpdateBrandTranslationBodyDTO extends createZodDto(
  UpdateBrandTranslationBodySchema,
) {}
export class GetBrandTranslationDetailResDTO extends createZodDto(
  GetBrandTranslationDetailResSchema,
) {}

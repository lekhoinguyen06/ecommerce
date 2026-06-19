import { createZodDto } from 'nestjs-zod';
import {
  CreateCategoryTranslationBodySchema,
  GetCategoryTranslationDetailResSchema,
  GetCategoryTranslationParamSchema,
  UpdateCategoryTranslationBodySchema,
} from './category-translation.model';

export class CreateCategoryTranslationBodyDTO extends createZodDto(
  CreateCategoryTranslationBodySchema,
) {}
export class UpdateCategoryTranslationBodyDTO extends createZodDto(
  UpdateCategoryTranslationBodySchema,
) {}
export class GetCategoryTranslationParamDTO extends createZodDto(
  GetCategoryTranslationParamSchema,
) {}
export class GetCategoryTranslationDetailResDTO extends createZodDto(
  GetCategoryTranslationDetailResSchema,
) {}

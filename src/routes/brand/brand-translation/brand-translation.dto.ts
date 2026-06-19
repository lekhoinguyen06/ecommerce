import { createZodDto } from 'nestjs-zod';
import {
  CreateBrandTranslationBodySchema,
  GetBrandTranslationDetailResSchema,
  GetBrandTranslationParamSchema,
  UpdateBrandTranslationBodySchema,
} from './brand-translation.model';

export class CreateBrandTranslationBodyDTO extends createZodDto(
  CreateBrandTranslationBodySchema,
) {}
export class UpdateBrandTranslationBodyDTO extends createZodDto(
  UpdateBrandTranslationBodySchema,
) {}
export class GetBrandTranslationParamDTO extends createZodDto(
  GetBrandTranslationParamSchema,
) {}
export class GetBrandTranslationDetailResDTO extends createZodDto(
  GetBrandTranslationDetailResSchema,
) {}

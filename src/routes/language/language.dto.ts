import { createZodDto } from 'nestjs-zod';

import {
  CreateLanguageBodySchema,
  UpdateLanguageBodySchema,
  DeleteLanguageBodySchema,
  GetLanguageParamsSchema,
  GetLanguageDetailResSchema,
  GetLanguagesResSchema,
} from './language.model';

export class GetLanguageParamsDTO extends createZodDto(
  GetLanguageParamsSchema,
) {}
export class GetLanguagesResDTO extends createZodDto(GetLanguagesResSchema) {}
export class GetLanguageDetailResDTO extends createZodDto(
  GetLanguageDetailResSchema,
) {}
export class CreateLanguageDTO extends createZodDto(CreateLanguageBodySchema) {}
export class UpdateLanguageDTO extends createZodDto(UpdateLanguageBodySchema) {}
export class DeleteLanguageDTO extends createZodDto(DeleteLanguageBodySchema) {}

import { createZodDto } from 'nestjs-zod';
import {
  CreateCategoryBodySchema,
  GetCategoryDetailResSchema,
  GetCategoryParamSchema,
  GetCategoriesResSchema,
  UpdateCategoryBodySchema,
} from './category.model';

export class CreateCategoryBodyDTO extends createZodDto(
  CreateCategoryBodySchema,
) {}
export class UpdateCategoryBodyDTO extends createZodDto(
  UpdateCategoryBodySchema,
) {}
export class GetCategoryParamDTO extends createZodDto(GetCategoryParamSchema) {}
export class GetCategoryDetailResDTO extends createZodDto(
  GetCategoryDetailResSchema,
) {}
export class GetCategoriesResDTO extends createZodDto(GetCategoriesResSchema) {}

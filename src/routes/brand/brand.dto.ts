import { createZodDto } from 'nestjs-zod';
import {
  CreateBrandBodySchema,
  GetBrandDetailResSchema,
  GetBrandParamSchema,
  GetBrandsResSchema,
  UpdateBrandBodySchema,
} from './brand.model';

export class CreateBrandBodyDTO extends createZodDto(CreateBrandBodySchema) {}
export class UpdateBrandBodyDTO extends createZodDto(UpdateBrandBodySchema) {}
export class GetBrandParamDTO extends createZodDto(GetBrandParamSchema) {}
export class GetBrandDetailResDTO extends createZodDto(
  GetBrandDetailResSchema,
) {}
export class GetBrandsResDTO extends createZodDto(GetBrandsResSchema) {}

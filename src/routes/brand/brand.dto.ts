import { createZodDto } from 'nestjs-zod';
import {
  CreateBrandBodySchema,
  GetBrandDetailResSchema,
  GetBrandsResSchema,
  UpdateBrandBodySchema,
} from './brand.model';

export class CreateBrandBodyDto extends createZodDto(CreateBrandBodySchema) {}
export class UpdateBrandBodyDto extends createZodDto(UpdateBrandBodySchema) {}
export class GetBrandDetailResDto extends createZodDto(
  GetBrandDetailResSchema,
) {}
export class GetBrandsResDto extends createZodDto(GetBrandsResSchema) {}

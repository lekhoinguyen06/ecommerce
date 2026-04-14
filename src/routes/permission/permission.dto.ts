import { createZodDto } from 'nestjs-zod';
import {
  CreatePermissionBodySchema,
  GetPermissionResSchema,
  GetPermissionsBodySchema,
  GetPermissionsParamSchema,
  UpdatePermissionBodySchema,
} from './permission.model';

export class CreatePermissionDTO extends createZodDto(
  CreatePermissionBodySchema,
) {}
export class UpdatePermissionDTO extends createZodDto(
  UpdatePermissionBodySchema,
) {}

export class GetPermissionParamsDTO extends createZodDto(
  GetPermissionsParamSchema,
) {}

export class GetPermissionResDTO extends createZodDto(GetPermissionResSchema) {}

export class GetPermissionDTO extends createZodDto(GetPermissionsBodySchema) {}

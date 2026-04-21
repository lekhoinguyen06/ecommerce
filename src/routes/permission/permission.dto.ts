import { createZodDto } from 'nestjs-zod';
import {
  CreatePermissionBodySchema,
  GetPermissionDetailResSchema,
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

export class GetPermissionDetailResDTO extends createZodDto(
  GetPermissionDetailResSchema,
) {}

export class GetPermissionResDTO extends createZodDto(GetPermissionResSchema) {}

export class GetPermissionDTO extends createZodDto(GetPermissionsBodySchema) {}

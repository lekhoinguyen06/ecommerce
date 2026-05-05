import { createZodDto } from 'nestjs-zod';
import {
  CreatePermissionBodySchema,
  GetPermissionDetailResSchema,
  GetPermissionResSchema,
  GetPermissionsQuerySchema,
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

export class GetPermissionQueryDTO extends createZodDto(
  GetPermissionsQuerySchema,
) {}

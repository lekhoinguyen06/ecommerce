import { createZodDto } from 'nestjs-zod';
import {
  CreateRoleBodySchema,
  GetRoleQuerySchema,
  GetRoleParamSchema,
  GetRoleDetailResSchema,
  GetRolesResSchema,
  UpdateRoleBodySchema,
} from './role.model';

export class GetRoleQueryDTO extends createZodDto(GetRoleQuerySchema) {}
export class GetRoleParamDTO extends createZodDto(GetRoleParamSchema) {}
export class GetRoleDetailResDTO extends createZodDto(GetRoleDetailResSchema) {}
export class GetRolesResDTO extends createZodDto(GetRolesResSchema) {}
export class CreateRoleDTO extends createZodDto(CreateRoleBodySchema) {}
export class UpdateRoleDTO extends createZodDto(UpdateRoleBodySchema) {}

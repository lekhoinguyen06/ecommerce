import { createZodDto } from 'nestjs-zod';
import {
  CreateRoleBodySchema,
  GetRoleBodySchema,
  GetRoleDetailResSchema,
  GetRolesResSchema,
  UpdateRoleBodySchema,
} from './role.model';

export class GetRoleBodyDTO extends createZodDto(GetRoleBodySchema) {}
export class GetRoleDetailResDTO extends createZodDto(GetRoleDetailResSchema) {}
export class GetRolesResDTO extends createZodDto(GetRolesResSchema) {}
export class CreateRoleDTO extends createZodDto(CreateRoleBodySchema) {}
export class UpdateRoleDTO extends createZodDto(UpdateRoleBodySchema) {}

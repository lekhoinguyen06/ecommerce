import { createZodDto } from 'nestjs-zod';
import {
  CreateUserBodySchema,
  GetUsersParamsSchema,
  GetUsersQuerySchema,
  GetUsersResSchema,
  UpdateUserBodySchema,
} from './user.model';
import {
  UpdateUserProfileResDTO,
  GetUserProfileResDTO,
} from 'src/shared/dto/shared-user.dto';

export class GetUsersResDTO extends createZodDto(GetUsersResSchema) {}

export class GetUsersParamsDTO extends createZodDto(GetUsersParamsSchema) {}

export class GetUsersQueryDTO extends createZodDto(GetUsersQuerySchema) {}

export class GetUserDetailResDTO extends GetUserProfileResDTO {}

export class CreateUserBodyDTO extends createZodDto(CreateUserBodySchema) {}

export class CreateUserResDTO extends UpdateUserProfileResDTO {}

export class UpdateUserBodyDTO extends createZodDto(UpdateUserBodySchema) {}

export class UpdateUserResDTO extends UpdateUserProfileResDTO {}

import { createZodDto } from 'nestjs-zod';
import {
  GetUserProfileResSchema,
  UpdateUserProfileResSchema,
} from '../models/shared-user.model';

export class GetProfileResDTO extends createZodDto(GetUserProfileResSchema) {}

export class UpdateProfileResDTO extends createZodDto(
  UpdateUserProfileResSchema,
) {}

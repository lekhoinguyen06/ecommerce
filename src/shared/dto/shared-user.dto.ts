import { createZodDto } from 'nestjs-zod';
import {
  GetUserProfileResSchema,
  UpdateUserProfileResSchema,
} from '../models/shared-user.model';

export class GetUserProfileResDto extends createZodDto(
  GetUserProfileResSchema,
) {}

export class UpdateUserProfileResDto extends createZodDto(
  UpdateUserProfileResSchema,
) {}

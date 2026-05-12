import { createZodDto } from 'nestjs-zod';
import { ChangePasswordBodySchema, UpdateMeBodySchema } from './profile.model';

export class UpdateProfileBodyDTO extends createZodDto(UpdateMeBodySchema) {}

export class ChangePasswordBodyDTO extends createZodDto(
  ChangePasswordBodySchema,
) {}

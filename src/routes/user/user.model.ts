import {
  GetUserProfileResSchema,
  UpdateUserProfileResType,
  UserSchema,
} from 'src/shared/models/shared-user.model';
import z from 'zod';
import { RoleSchema } from 'src/shared/models/shared-role.model';

// GET
export const GetUsersResSchema = z.object({
  data: z.array(
    UserSchema.omit({ password: true, totpSecret: true }).extend({
      role: RoleSchema.pick({ id: true, name: true }),
    }),
  ),

  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const GetUsersQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(1),
  })
  .strict();

export const GetUsersParamsSchema = z
  .object({
    userId: z.coerce.number().int().positive(),
  })
  .strict();

// POST
export const CreateUserBodySchema = UserSchema.pick({
  email: true,
  password: true,
  phoneNumber: true,
  avatar: true,
  roleId: true,
  name: true,
  status: true,
}).strict();

// PUT
export const UpdateUserBodySchema = CreateUserBodySchema.partial().strict();

// Types
export type GetUsersResType = z.infer<typeof GetUsersResSchema>;
export type GetUsersQueryType = z.infer<typeof GetUsersQuerySchema>;
export type GetUsersParamsType = z.infer<typeof GetUsersParamsSchema>;
export type GetUserDetailResType = z.infer<typeof GetUserProfileResSchema>;
export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>;
export type CreateUserResType = UpdateUserProfileResType;
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>;
export type UpdateUserResType = UpdateUserProfileResType;

import * as z from 'zod';
import { TypeOfUserStatus } from '../constants/auth.constant';
import { RoleSchema } from './shared-role.model';
import { PermissionSchema } from './shared-permission.model';

export const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string().min(2).max(50),
  password: z.string().min(8).max(20),
  phoneNumber: z.string(),
  avatar: z.string().nullable(),
  status: z.enum(TypeOfUserStatus),
  totpSecret: z.string().nullable(),
  roleId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
});

/*
 * Used for GET('user/userId') and GET('profile')
 */
export const GetUserProfileResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  role: RoleSchema.pick({ id: true, name: true, description: true }).extend({
    permissions: z.array(
      PermissionSchema.pick({
        id: true,
        name: true,
        method: true,
        module: true,
        path: true,
      }),
    ),
  }),
});

/*
 * Used for PUT('user/userId') and PUT('/profile')
 */
export const UpdateUserProfileResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

// Types
export type UserType = z.infer<typeof UserSchema>;
export type GetUserProfileResType = z.infer<typeof GetUserProfileResSchema>;
export type UpdateUserProfileResType = z.infer<
  typeof UpdateUserProfileResSchema
>;

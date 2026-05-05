import z from 'zod';
import { RoleSchema } from 'src/shared/models/shared-role.model';

// GET
export const GetRoleBodySchema = z
  .object({
    page: z.coerce.number().int().default(1),
    limit: z.coerce.number().int().default(10),
  })
  .strict();

// POST
export const CreateRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
}).extend({
  permissionIds: z.array(z.number()).optional(),
});

// UPDATE
export const UpdateRoleBodySchema = RoleSchema.partial()
  .pick({
    name: true,
    description: true,
    isActive: true,
  })
  .extend({
    permissionIds: z.array(z.number()).optional(),
  });

// RESPONSE
export const GetRoleDetailResSchema = RoleSchema;

export const GetRolesResSchema = z.object({
  data: z.array(RoleSchema),
  itemsCount: z.number(),
});

// Types
export type RoleType = z.infer<typeof RoleSchema>;
export type GetRoleBodyType = z.infer<typeof GetRoleBodySchema>;
export type CreateRoleType = z.infer<typeof CreateRoleBodySchema>;
export type UpdateRoleType = z.infer<typeof UpdateRoleBodySchema>;
export type GetRoleDetailResType = z.infer<typeof GetRoleDetailResSchema>;
export type GetRolesResType = z.infer<typeof GetRolesResSchema>;

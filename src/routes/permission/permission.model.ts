import { HTTPMethod } from 'src/shared/constants/permission.constant';
import z from 'zod';

export const PermissionSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().default(''),
  path: z.string(),
  method: z.enum(HTTPMethod),

  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedById: z.number().int().nullable(),

  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// QUERY
export const GetPermissionsBodySchema = z
  .object({
    page: z.coerce.number().int().default(1),
    limit: z.coerce.number().int().default(10),
  })
  .strict();

export const GetPermissionsParamSchema = z
  .object({
    permissionId: z.coerce.number().int(),
  })
  .strict();

export const GetPermissionResSchema = z.object({
  data: z.array(PermissionSchema),
  totalItems: z.number().int(),
  totalPages: z.number().int(),
  currentPage: z.number().int(),
  limit: z.number().int(),
});

export const GetPermissionDetailResSchema = PermissionSchema;

// CREATE
export const CreatePermissionBodySchema = PermissionSchema.pick({
  name: true,
  path: true,
  description: true,
  method: true,
}).strict();

// UPDATE
export const UpdatePermissionBodySchema =
  CreatePermissionBodySchema.partial().strict();

// Types
export type PermissionType = z.infer<typeof PermissionSchema>;
export type GetPermissionsBodyType = z.infer<typeof GetPermissionsBodySchema>;
export type GetPermissionsParamType = z.infer<typeof GetPermissionsParamSchema>;
export type GetPermissionResType = z.infer<typeof GetPermissionResSchema>;
export type GetPermissionDetailResType = z.infer<
  typeof GetPermissionDetailResSchema
>;
export type CreatePermissionBodyType = z.infer<
  typeof CreatePermissionBodySchema
>;
export type UpdatePermissionBodyType = z.infer<
  typeof UpdatePermissionBodySchema
>;

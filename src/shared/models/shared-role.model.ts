import z from 'zod';
import { PermissionSchema } from './shared-permission.model';

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().default(''),
  isActive: z.boolean().default(true),
  permissions: z.array(PermissionSchema).nullable().optional(),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),

  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

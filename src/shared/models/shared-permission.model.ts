import z from 'zod';
import { HTTPMethod } from '../constants/permission.constant';

export const PermissionSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().default(''),
  path: z.string(),
  method: z.enum(HTTPMethod),
  module: z.string().default(''),

  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedById: z.number().int().nullable(),

  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

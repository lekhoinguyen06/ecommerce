import * as z from 'zod';
import { TypeOfUserStatus } from '../constants/auth.constant';

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

export type UserType = z.infer<typeof UserSchema>;

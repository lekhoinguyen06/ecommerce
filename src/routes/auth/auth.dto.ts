import { createZodDto } from 'nestjs-zod';
import { UserStatus } from 'src/generated/prisma/enums';
import * as z from 'zod';

const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  avatar: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
  roleId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
});

const RegisterBodySchema = z
  .object({
    email: z.email(),
    password: z.string().min(8).max(20),
    name: z.string().min(2).max(50),
    confirmPassword: z.string().min(8).max(20),
    phoneNumber: z.string().min(10).max(15),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'invalid_value',
        message: 'Password and confirm password do not match',
        values: [confirmPassword],
        path: ['confirmPassword'],
      });
    }
  });

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}
export class RegisterResDTO extends createZodDto(UserSchema) {}

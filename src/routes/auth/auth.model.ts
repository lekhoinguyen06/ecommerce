import * as z from 'zod';
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant';
import { UserSchema } from 'src/shared/models/shared-user.model';

// Registration
export const RegisterBodySchema = UserSchema.pick({
  email: true,
  name: true,
  password: true,
  phoneNumber: true,
})
  .extend({
    confirmPassword: z.string().min(8).max(20),
    code: z.string().length(6),
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

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;

export const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

export type RegisterResType = z.infer<typeof RegisterResSchema>;

// Verification
export const VerificationCodeSchema = z.object({
  id: z.number(),
  email: z.email(),
  code: z.string().length(6),
  type: z.enum(TypeOfVerificationCode),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;

export const SendOTPBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
});

export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>;

// Login
export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
}).strict();

export type LoginBodyType = z.infer<typeof LoginBodySchema>;

export const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type LoginResType = z.infer<typeof LoginResSchema>;

//  RefreshToken
export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>;

export const RefreshTokenResSchema = LoginBodySchema;

export type RefreshTokenResType = LoginResType;

// Device
export const DeviceSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userAgent: z.string(),
  ip: z.string(),
  lastActive: z.date(),
  createAt: z.date(),
  isActive: z.boolean(),
});

export type DeviceType = z.infer<typeof DeviceSchema>;

// Role
export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RoleType = z.infer<typeof RoleSchema>;

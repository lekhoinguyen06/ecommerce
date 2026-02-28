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
export const VerificationCode = z.object({
  id: z.number(),
  email: z.email(),
  code: z.string().length(6),
  type: z.enum(TypeOfVerificationCode),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export type VerificationCodeType = z.infer<typeof VerificationCode>;

export const SendOTPBodySchema = VerificationCode.pick({
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

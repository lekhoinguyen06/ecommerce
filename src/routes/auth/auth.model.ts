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

export const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
});

// Verification
export const VerificationCodeSchema = z.object({
  id: z.number(),
  email: z.email(),
  code: z.string().length(6),
  type: z.enum(TypeOfVerificationCode),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const SendOTPBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
});

// Login
export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
})
  .extend({
    totpCode: z.string().length(6).optional(), // 2FA code
    code: z.string().length(6).optional(), // Email OTP code
  })
  .strict()
  .superRefine(({ totpCode, code }, ctx) => {
    const message = 'Either totpCode or code must be provided, but not both';
    if (totpCode !== undefined && code !== undefined) {
      ctx.addIssue({
        path: ['totpCode'],
        code: 'invalid_value',
        message,
        values: [totpCode],
      });
      ctx.addIssue({
        path: ['code'],
        code: 'invalid_value',
        message,
        values: [code],
      });
    }
  });

export const LoginResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

//  RefreshToken
export const RefreshTokenSchema = z.object({
  token: z.string(),
  userId: z.number(),
  deviceId: z.number(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export const RefreshTokenResSchema = LoginResSchema;

// Logout
export const LogoutBodySchema = RefreshTokenBodySchema;

// Forgot Password
export const ForgotPasswordBodySchema = z
  .object({
    email: z.email(),
    code: z.string().length(6),
    newPassword: z.string().min(8).max(20),
    confirmNewPassword: z.string().min(8).max(20),
  })
  .strict()
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: 'invalid_value',
        message: 'Password and confirm password do not match',
        values: [confirmNewPassword],
        path: ['confirmNewPassword'],
      });
    }
  });

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

// Google OAuth
export const GoogleOAuthStateSchema = DeviceSchema.pick({
  userAgent: true,
  ip: true,
});

export const GetAuthURLResSchema = z.object({
  url: z.string(),
});

// 2FA
export const Disable2FABodySchema = z
  .object({
    totpCode: z.string().length(6).optional(), // 2FA code
    code: z.string().length(6).optional(), // Email OTP code
  })
  .strict()
  .superRefine(({ totpCode, code }, ctx) => {
    const message = 'Either totpCode or code must be provided, but not both';
    if ((totpCode !== undefined) === (code !== undefined)) {
      ctx.addIssue({
        path: ['totpCode'],
        code: 'invalid_value',
        message,
        values: [totpCode],
      });
      ctx.addIssue({
        path: ['code'],
        code: 'invalid_value',
        message,
        values: [code],
      });
    }
  });

export const TwoFASetupResSchema = z.object({
  secret: z.string(),
  uri: z.string(),
});

// Types
export type RegisterBodyType = z.infer<typeof RegisterBodySchema>;
export type RegisterResType = z.infer<typeof RegisterResSchema>;
export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>;
export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>;
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>;
export type RefreshTokenResType = LoginResType;
export type LoginBodyType = z.infer<typeof LoginBodySchema>;
export type LoginResType = z.infer<typeof LoginResSchema>;
export type LogoutBodyType = RefreshTokenBodyType;
export type RoleType = z.infer<typeof RoleSchema>;
export type DeviceType = z.infer<typeof DeviceSchema>;
export type GoogleOAuthStateType = z.infer<typeof GoogleOAuthStateSchema>;
export type GetAuthURLResType = z.infer<typeof GetAuthURLResSchema>;
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBodySchema>;
export type Disable2FABodyType = z.infer<typeof Disable2FABodySchema>;
export type TwoFASetupResType = z.infer<typeof TwoFASetupResSchema>;

import { UserSchema } from 'src/shared/models/shared-user.model';
import z from 'zod';

export const UpdateMeBodySchema = UserSchema.pick({
  name: true,
  avatar: true,
  phoneNumber: true,
})
  .partial()
  .strict();

export const ChangePasswordBodySchema = UserSchema.pick({
  password: true,
})
  .extend({
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
  })
  .superRefine(({ password, newPassword }, ctx) => {
    if (password === newPassword) {
      ctx.addIssue({
        code: 'invalid_value',
        message: 'New password must be different from the current password',
        values: [newPassword],
        path: ['newPassword'],
      });
    }
  });

// Types
export type UpdateMeBodyType = z.infer<typeof UpdateMeBodySchema>;
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>;

import * as z from 'zod';

export const LanguageSchema = z.object({
  id: z.string().max(10),
  name: z.string(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetLanguageParamsSchema = LanguageSchema.pick({
  id: true,
}).strict();

export const GetLanguagesResSchema = z.object({
  data: z.array(LanguageSchema),
  itemsCount: z.number(),
});

export const GetLanguageDetailResSchema = LanguageSchema;

export const CreateLanguageBodySchema = LanguageSchema.pick({
  id: true,
  name: true,
}).strict();

export const UpdateLanguageBodySchema = LanguageSchema.pick({
  id: true,
  name: true,
}).strict();

export const DeleteLanguageBodySchema = LanguageSchema.pick({
  id: true,
}).strict();

// Types
export type LanguageType = z.infer<typeof LanguageSchema>;
export type GetLanguageParamsType = z.infer<typeof GetLanguageParamsSchema>;
export type GetLanguagesResType = z.infer<typeof GetLanguagesResSchema>;
export type GetLanguageDetailResType = z.infer<
  typeof GetLanguageDetailResSchema
>;
export type CreateLanguageType = z.infer<typeof CreateLanguageBodySchema>;
export type UpdateLanguageType = z.infer<typeof UpdateLanguageBodySchema>;
export type DeleteLanguageType = z.infer<typeof DeleteLanguageBodySchema>;

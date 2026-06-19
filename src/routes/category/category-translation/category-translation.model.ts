import z from 'zod';

export const CategoryTranslationSchema = z.object({
  id: z.number(),
  categoryId: z.number(),
  languageId: z.string(),
  name: z.string(),
  description: z.string().nullable(),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// CRUD
export const CreateCategoryTranslationBodySchema =
  CategoryTranslationSchema.pick({
    categoryId: true,
    languageId: true,
    name: true,
    description: true,
  });

export const UpdateCategoryTranslationBodySchema =
  CategoryTranslationSchema.pick({
    name: true,
    description: true,
  });

export const GetCategoryTranslationParamSchema = z.object({
  categoryTranslationId: z.coerce.number(),
});
export const GetCategoryTranslationDetailResSchema = CategoryTranslationSchema;

// Types
export type CategoryTranslationType = z.infer<typeof CategoryTranslationSchema>;
export type CreateCategoryTranslationBodyType = z.infer<
  typeof CreateCategoryTranslationBodySchema
>;
export type UpdateCategoryTranslationBodyType = z.infer<
  typeof UpdateCategoryTranslationBodySchema
>;
export type GetCategoryTranslationDetailResType = z.infer<
  typeof GetCategoryTranslationDetailResSchema
>;

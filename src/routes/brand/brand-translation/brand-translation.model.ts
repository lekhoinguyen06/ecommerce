import z from 'zod';

export const BrandTranslationSchema = z.object({
  id: z.number(),
  brandId: z.number(),
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
export const CreateBrandTranslationBodySchema = BrandTranslationSchema.pick({
  brandId: true,
  languageId: true,
  name: true,
  description: true,
});

export const UpdateBrandTranslationBodySchema = BrandTranslationSchema.pick({
  name: true,
  description: true,
});

export const GetBrandTranslationDetailResSchema = BrandTranslationSchema;

// Types
export type BrandTranslationType = z.infer<typeof BrandTranslationSchema>;
export type CreateBrandTranslationBodyType = z.infer<
  typeof CreateBrandTranslationBodySchema
>;
export type UpdateBrandTranslationBodyType = z.infer<
  typeof UpdateBrandTranslationBodySchema
>;
export type GetBrandTranslationDetailResType = z.infer<
  typeof GetBrandTranslationDetailResSchema
>;

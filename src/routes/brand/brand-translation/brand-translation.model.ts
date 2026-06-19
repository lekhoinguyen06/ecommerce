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
export const BrandTranslationCreateBodySchema = BrandTranslationSchema.pick({
  brandId: true,
  languageId: true,
  name: true,
  description: true,
});

export const BrandTranslationUpdateBodySchema = BrandTranslationSchema.pick({
  brandId: true,
  languageId: true,
  name: true,
  description: true,
});

export const BrandTranslationDetailResSchema = BrandTranslationSchema;

// Types
export type BrandTranslationType = z.infer<typeof BrandTranslationSchema>;
export type BrandTranslationCreateBodyType = z.infer<
  typeof BrandTranslationCreateBodySchema
>;
export type BrandTranslationUpdateBodyType = z.infer<
  typeof BrandTranslationUpdateBodySchema
>;
export type BrandTranslationDetailResType = z.infer<
  typeof BrandTranslationDetailResSchema
>;

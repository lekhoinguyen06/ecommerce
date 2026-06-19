import z from 'zod';
import { BrandTranslationSchema } from './brand-translation/brand-translation.model';

export const BrandSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string().nullable(),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BrandWithTranslationsSchema = BrandSchema.extend({
  translations: z.array(BrandTranslationSchema).optional(),
});

// CRUD
export const CreateBrandBodySchema = BrandSchema.pick({
  name: true,
  logo: true,
});

export const UpdateBrandBodySchema = BrandSchema.pick({
  name: true,
  logo: true,
});

export const GetBrandParamSchema = z
  .object({
    brandId: z.coerce.number(),
  })
  .strict();

export const GetBrandDetailResSchema = BrandWithTranslationsSchema;

export const GetBrandsResSchema = z.object({
  data: z.array(BrandWithTranslationsSchema),
  totalItems: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  limit: z.number(),
});

// Types
export type BrandType = z.infer<typeof BrandSchema>;
export type BrandWithTranslationsType = z.infer<
  typeof BrandWithTranslationsSchema
>;
export type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>;
export type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>;
export type GetBrandDetailResType = z.infer<typeof GetBrandDetailResSchema>;
export type GetBrandsResType = z.infer<typeof GetBrandsResSchema>;

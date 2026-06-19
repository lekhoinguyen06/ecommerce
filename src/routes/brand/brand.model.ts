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
  translations: z.array(BrandTranslationSchema),
});

// CRUD
export const BrandCreateBodySchema = BrandSchema.pick({
  name: true,
  logo: true,
});

export const BrandUpdateBodySchema = BrandSchema.pick({
  name: true,
  logo: true,
});

export const BrandDetailResSchema = BrandSchema;

// Types
export type BrandType = z.infer<typeof BrandSchema>;
export type BrandTranslationsType = z.infer<typeof BrandWithTranslationsSchema>;
export type BrandCreateBodyType = z.infer<typeof BrandCreateBodySchema>;
export type BrandUpdateBodyType = z.infer<typeof BrandUpdateBodySchema>;
export type BrandDetailResType = z.infer<typeof BrandDetailResSchema>;

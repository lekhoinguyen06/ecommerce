import z from 'zod';
import { CategoryTranslationSchema } from './category-translation/category-translation.model';

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  parentCategoryId: z.number().nullable(),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CategoryWithSubCategoriesAndTranslationsSchema =
  CategorySchema.extend({
    translations: z.array(CategoryTranslationSchema).optional(),
    subCategories: z.array(CategorySchema).optional(),
  });

// CRUD
export const CreateCategoryBodySchema = CategorySchema.pick({
  name: true,
});

export const UpdateCategoryBodySchema = CategorySchema.pick({
  name: true,
});

export const GetCategoryParamSchema = z
  .object({
    categoryId: z.coerce.number(),
  })
  .strict();

export const GetCategoryDetailResSchema =
  CategoryWithSubCategoriesAndTranslationsSchema;

export const GetCategoriesResSchema = z.object({
  data: z.array(CategoryWithSubCategoriesAndTranslationsSchema),
  totalItems: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  limit: z.number(),
});

// Types
export type CategoryType = z.infer<typeof CategorySchema>;
export type FullCategoryType = z.infer<
  typeof CategoryWithSubCategoriesAndTranslationsSchema
>;
export type CreateCategoryBodyType = z.infer<typeof CreateCategoryBodySchema>;
export type UpdateCategoryBodyType = z.infer<typeof UpdateCategoryBodySchema>;
export type GetCategoryDetailResType = z.infer<
  typeof GetCategoryDetailResSchema
>;
export type GetCategoriesResType = z.infer<typeof GetCategoriesResSchema>;

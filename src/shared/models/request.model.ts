import * as z from 'zod';

export const EmptyBodySchema = z.object({}).strict();

export const PaginationQueryBodySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
});

export type EmptyBodyType = z.infer<typeof EmptyBodySchema>;
export type PaginationQueryBodyType = z.infer<typeof PaginationQueryBodySchema>;

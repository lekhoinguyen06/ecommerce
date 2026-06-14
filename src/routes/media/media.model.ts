import { ALLOWED_IMAGE_EXTENSIONS } from 'src/shared/constants/media.constant';
import { z } from 'zod';

export const PresignedUrlBodySchema = z.object({
  fileName: z
    .string()
    .startsWith('images/')
    .refine((value) => {
      const allowedExtensions = ALLOWED_IMAGE_EXTENSIONS;
      return allowedExtensions.some((ext) => value.toLowerCase().endsWith(ext));
    }),
});

export const PresignedUrlResSchema = z.object({
  presignedUrl: z.url(),
  url: z.url(),
});

export const UploadedFileResSchema = z.object({
  url: z.url(),
  key: z.string(),
  bucket: z.string(),
});

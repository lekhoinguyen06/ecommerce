import { createZodDto } from 'nestjs-zod';
import {
  PresignedUrlBodySchema,
  PresignedUrlResSchema,
  UploadedFileResSchema,
} from './media.model';

export class PresignedUrlBodyDTO extends createZodDto(PresignedUrlBodySchema) {}
export class PresignedUrlResDTO extends createZodDto(PresignedUrlResSchema) {}
export class UploadedFileResDTO extends createZodDto(UploadedFileResSchema) {}

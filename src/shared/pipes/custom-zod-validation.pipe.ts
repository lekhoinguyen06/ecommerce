import { UnprocessableEntityException } from '@nestjs/common';
import { createZodValidationPipe, ZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

export const CustomZodValidationPipe: typeof ZodValidationPipe =
  createZodValidationPipe({
    createValidationException: (error: unknown) =>
      new UnprocessableEntityException(JSON.parse((error as ZodError).message)),
  });

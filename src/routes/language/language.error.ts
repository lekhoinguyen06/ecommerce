import { UnprocessableEntityException } from '@nestjs/common';

export const LanguageAlreadyExistsError = new UnprocessableEntityException([
  {
    message: 'Error.LanguageAlreadyExists',
    path: 'id',
  },
]);

export const LanguageNotFoundError = new UnprocessableEntityException([
  {
    message: 'Error.LanguageNotFound',
    path: 'id',
  },
]);

import { UnprocessableEntityException } from '@nestjs/common';

export const LanguageAlreadyExistsError = new UnprocessableEntityException([
  {
    message: 'Error.LanguageAlreadyExists',
    path: 'id',
  },
]);

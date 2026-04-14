import { UnprocessableEntityException } from '@nestjs/common';

export const NotFoundRecord = new UnprocessableEntityException({
  message: 'Error.RecordNotFound',
  path: 'id',
});

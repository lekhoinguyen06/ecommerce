import { UnprocessableEntityException } from '@nestjs/common';

export const NotFoundRecordException = new UnprocessableEntityException({
  message: 'Error.RecordNotFound',
  path: 'id',
});

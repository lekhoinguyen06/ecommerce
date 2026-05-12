import { UnprocessableEntityException } from '@nestjs/common';

export const NotFoundRecordException = new UnprocessableEntityException({
  message: 'Error.RecordNotFound',
  path: 'id',
});

// Password
export const IncorrectPasswordException = new UnprocessableEntityException([
  {
    message: 'Error.IncorrectPassword',
    path: 'password',
  },
]);

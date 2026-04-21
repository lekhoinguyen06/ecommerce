import { UnprocessableEntityException } from '@nestjs/common';

export const PermissionAlreadyExistsError = new UnprocessableEntityException([
  {
    message: 'Error.PermissionAlreadyExists',
    path: 'path',
  },
  {
    message: 'Error.PermissionAlreadyExists',
    path: 'method',
  },
]);

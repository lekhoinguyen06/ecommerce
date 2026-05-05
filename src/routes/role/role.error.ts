import { UnprocessableEntityException } from '@nestjs/common';

export const RoleAlreadyExistsException = new UnprocessableEntityException({
  path: 'name',
  message: 'Error.RoleAlreadyExists',
});

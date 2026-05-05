import { UnprocessableEntityException } from '@nestjs/common';

export const RoleAlreadyExistsError = new UnprocessableEntityException({
  path: 'name',
  message: 'Error.RoleAlreadyExists',
});

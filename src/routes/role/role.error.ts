import { UnprocessableEntityException } from '@nestjs/common';

export const RoleAlreadyExistsException = new UnprocessableEntityException({
  path: 'name',
  message: 'Error.RoleAlreadyExists',
});

export const ProhibitActionOnBaseRoleException =
  new UnprocessableEntityException({
    path: 'id',
    message: 'Error.ProhibitActionOnBaseRole',
  });

import { UnprocessableEntityException } from '@nestjs/common';

export const UserAlreadyExistsException = new UnprocessableEntityException([
  {
    message: 'Error.UserAlreadyExists',
    path: 'email',
  },
]);

export const CannotUpdateAdminUserException = new UnprocessableEntityException(
  'Error.CannotUpdateAdminUser',
);

export const CannotDeleteAdminUserException = new UnprocessableEntityException(
  'Error.CannotDeleteAdminUser',
);

export const CannotSetAdminRoleToUserException =
  new UnprocessableEntityException('Error.CannotSetAdminRoleToUser');

export const RoleNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.RoleNotFound',
    path: 'roleId',
  },
]);

export const CannotModifySelfException = new UnprocessableEntityException(
  'Error.CannotSelfDelete',
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_ROLE_PERMISSIONS_KEY } from '../constants/auth.constant';
import { Request } from 'express';
import { RoleWithPermissionsType } from '../models/shared-role.model';

export const ActiveRolePermissions = createParamDecorator(
  (field: keyof RoleWithPermissionsType | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const permissions: RoleWithPermissionsType | undefined =
      request[REQUEST_ROLE_PERMISSIONS_KEY];
    return field ? permissions?.[field] : permissions;
  },
);

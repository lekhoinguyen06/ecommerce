import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from 'src/types/jwt.type';
import { REQUEST_USER_KEY } from '../constants/auth.constant';
import { Request } from 'express';

export const ActiveUser = createParamDecorator(
  (field: keyof TokenPayload | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: TokenPayload | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);

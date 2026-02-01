import { SetMetadata } from '@nestjs/common';
import { AuthTypeType, GuardConditionType } from '../constants/auth.constant';

export const AUTH_TYPE_KEY = 'authType';
export type AuthTypeDecoratorPayload = {
  authTypes: AuthTypeType[];
  options: { condition: GuardConditionType };
};
export const Auth = (
  authTypes: AuthTypeType[],
  options: { condition: GuardConditionType },
) => {
  return SetMetadata(AUTH_TYPE_KEY, { authTypes, options });
};

export const REQUEST_USER_KEY = 'user';

export const AuthType = {
  Bearer: 'Bearer',
  APIKey: 'APIKey',
  None: 'None',
} as const;

export type AuthTypeType = (typeof AuthType)[keyof typeof AuthType];

export const GuardCondition = {
  And: 'And',
  Or: 'Or',
} as const;

export type GuardConditionType =
  (typeof GuardCondition)[keyof typeof GuardCondition];

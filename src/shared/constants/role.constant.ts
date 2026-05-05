export const RoleName = {
  Admin: 'ADMIN',
  Client: 'CLIENT',
  Seller: 'SELLER',
} as const;

export type RoleNameType = (typeof RoleName)[keyof typeof RoleName];

export const baseRoles = new Set<RoleNameType>([
  RoleName.Admin,
  RoleName.Client,
  RoleName.Seller,
]);

export const userRoles = ['admin', 'user', 'store_admin'] as const;
export type UserRole = (typeof userRoles)[number];

export const storeMembershipRoles = ['admin'] as const;
export type StoreMembershipRole = (typeof storeMembershipRoles)[number];

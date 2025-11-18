import {
  StoreMembershipRole,
  UserRole,
} from '@/features/users/schemas/userSchema';

export function canAccessAdminPages({
  roles,
}: {
  roles: UserRole[] | undefined;
}) {
  return roles?.includes('admin');
}

export function canAccessStoreAdminPages({
  roles,
  storeId,
  storeMemberships,
}: {
  roles: UserRole[] | undefined;
  storeId?: string;
  storeMemberships:
    | {
        storeId: string;
        roles: StoreMembershipRole[];
      }[]
    | undefined;
}) {
  if (roles?.includes('admin')) {
    return true;
  }

  if (!storeId) {
    // check if they have admin access to any store
    return (
      roles?.includes('store_admin') &&
      storeMemberships?.some((membership) => membership.roles.includes('admin'))
    );
  }

  // check if they have admin access to the specific store
  return (
    roles?.includes('store_admin') &&
    storeMemberships?.some(
      (membership) =>
        membership.storeId === storeId && membership.roles.includes('admin')
    )
  );
}

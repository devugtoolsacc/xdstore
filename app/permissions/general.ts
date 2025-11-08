import { UserRole } from '@/features/users/schemas/userSchema';

export function canAccessAdminPages({
  roles,
}: {
  roles: UserRole[] | undefined;
}) {
  return roles?.includes('admin');
}

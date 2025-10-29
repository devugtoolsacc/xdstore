import { UserRole } from '@/drizzle/schema/user';

export function canAccessAdminPages(role: UserRole | undefined) {
  return role === 'admin';
}

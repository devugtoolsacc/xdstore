import { UserRole } from '@/features/users/schemas/userSchema';

export function canAccessAdminPages({ role }: { role: UserRole | undefined }) {
  return role === 'admin';
}

import Link from 'next/link';
import { getCurrentUser } from '../services/clerk';
import { canAccessAdminPages } from '../permissions/general';

export default async function AdminLink() {
  // const user = await getCurrentUser();

  // if (!canAccessAdminPages(user)) return null;
  return (
    <Link href="/admin" className="hover:bg-accent/10 flex items-center px-2">
      Admin
    </Link>
  );
}

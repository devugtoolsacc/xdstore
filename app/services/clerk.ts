import { auth, clerkClient } from '@clerk/nextjs/server';
import { UserRole, UserTable } from '@/drizzle/schema/user';
import { unstable_cacheTag } from 'next/cache';
import { getUserTag } from '@/lib/dataCache';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';

const client = await clerkClient();

export async function getCurrentUser({
  allData = false,
}: { allData?: boolean } = {}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId,
    role: sessionClaims?.role,
    user:
      allData && sessionClaims?.dbId
        ? await getUser(sessionClaims.dbId)
        : undefined,
    redirectToSignIn,
  };
}

export function syncClerkUserMetadata(user: {
  id: string;
  clerkUserId: string;
  role: UserRole;
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.id,
      role: user.role,
    },
  });
}

export async function getUser(userId: string) {
  'use cache';
  unstable_cacheTag(getUserTag('users', userId));

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
  });
}

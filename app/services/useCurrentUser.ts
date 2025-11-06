import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useSession } from '@clerk/clerk-react';

export function useCurrentUser(allData = false) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { session } = useSession();

  const shouldSkip = allData ? undefined : 'skip';
  const user = useQuery(api.users.current, shouldSkip);
  // Combine the authentication state with the user existence check
  return {
    isLoading: isLoading || (isAuthenticated && user === null),
    isAuthenticated: isAuthenticated && user !== null,
    user: {
      id: session?.user.publicMetadata.dbId,
      externalId: session?.user.id,
      name: session?.user.fullName,
      email: session?.user.emailAddresses[0].emailAddress,
      imageUrl: session?.user.imageUrl,
      role: session?.user.publicMetadata.role,
      user,
    },
  };
}

import { UserRole } from '@/features/users/schemas/userSchema';
import { StoreMembershipRole } from '@/features/users/schemas/userSchema';

export {};

declare global {
  interface CustomJwtSessionClaims {
    dbId?: string;
    roles: UserRole[];
    storeMemberships?: {
      storeId: string;
      roles: StoreMembershipRole[];
    }[];
  }

  interface UserPublicMetadata {
    dbId?: string;
    roles: UserRole[];
    storeMemberships?: {
      storeId: string;
      roles: StoreMembershipRole[];
    }[];
  }
}

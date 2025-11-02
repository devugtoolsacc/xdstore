import { UserRole } from '@/drizzle/schema/user';

export {};

declare global {
  interface CustomJwtSessionClaims {
    dbId?: string;
    role?: UserRole;
  }

  interface UserPublicMetadata {
    dbId?: string;
    role?: UserRole;
  }
}

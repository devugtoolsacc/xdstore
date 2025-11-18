import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import {
  canAccessAdminPages,
  canAccessStoreAdminPages,
} from './app/permissions/general';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)',
  '/carts/:id',
  '/store/:id',
]);

const isStoreAdminRoute = createRouteMatcher(['/admin/store/:id(.*)']);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isStoreAdminRoute(req)) {
    const user = await auth.protect();

    const storeId = req.nextUrl.pathname.split('/')[3];

    if (
      !canAccessStoreAdminPages({
        roles: user.sessionClaims.roles,
        storeId,
        storeMemberships: user.sessionClaims.storeMemberships,
      })
    ) {
      return notFound();
    }

    return;
  }

  if (isAdminRoute(req)) {
    const user = await auth.protect();
    if (!canAccessAdminPages({ roles: user.sessionClaims.roles })) {
      // redirect to the store admin page if user is only store admin
      if (
        user.sessionClaims.roles?.includes('store_admin') &&
        Array.isArray(user.sessionClaims.storeMemberships) &&
        user.sessionClaims.storeMemberships.length > 0
      ) {
        return NextResponse.redirect(
          new URL(
            `/admin/store/${user.sessionClaims.storeMemberships[0].storeId}`,
            req.nextUrl
          )
        );
      }

      return notFound();
    }
  }
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

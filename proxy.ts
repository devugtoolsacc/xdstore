import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { canAccessAdminPages } from './app/permissions/general';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)',
  '/carts/:id',
  '/store/:id',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const user = await auth.protect();
    if (!canAccessAdminPages({ roles: user.sessionClaims.roles })) {
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

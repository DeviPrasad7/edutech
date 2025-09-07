// middleware.js

import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // Add any public routes here. These routes will be accessible to everyone.
  // Example: publicRoutes: ["/"],
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!.+\\.[\\w]+$|_next).*)',
    // Re-include API routes and TRPC routes
    '/(api|trpc)(.*)',
  ],
};

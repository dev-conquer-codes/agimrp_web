import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import axios from 'axios';

const isProtectedRoute = createRouteMatcher(['/adminDashboard(.*)', '/auth(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

  const user = await auth();
  const userId = user.userId;

  if (isProtectedRoute(req)) {
    try {
      // Fetch user role
      console.log(userId);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/admin/is_admin`,
        { recordId: userId }
      );
      const data = response.data;
      const userStatus = data.status;
      const pathname = req.nextUrl.pathname;

      // Role-based access control
      const accessDenied =
        pathname.startsWith('/adminDashboard') && userStatus === 'no';

      if (accessDenied) {
        // Sign out the user if access is denied
        

        // Optionally, you can redirect the user to the login page
        return new Response('Forbidden: You do not have access to this page.', {
          status: 403,
          headers: {
            Location: '/', // Redirect to login page after sign-out
          },
        });
      }

    } catch (error) {
      console.error('Error fetching user role:', error);
      // Optionally, handle error (e.g., log out the user, redirect, etc.)
      return new Response('Internal Server Error', { status: 500 });
    }
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

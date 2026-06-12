import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  // Protect game routes but NOT the landing page (/)
  matcher: ['/results/:path*', '/profile', '/play', '/lobby/:path*', '/game/:path*'],
};

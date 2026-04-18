import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/lobby/:path*', '/game/:path*', '/results/:path*', '/profile', '/play'],
};

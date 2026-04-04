import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import jwt from 'jsonwebtoken';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.sub = profile.sub ?? token.sub;
        token.picture = (profile as { picture?: string }).picture ?? token.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub ?? '';
      }
      const accessToken = jwt.sign(
        {
          sub: token.sub,
          name: token.name,
          email: token.email,
          picture: token.picture,
        },
        process.env.NEXTAUTH_SECRET!,
        { algorithm: 'HS256', expiresIn: '7d' }
      );
      (session as { accessToken?: string }).accessToken = accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

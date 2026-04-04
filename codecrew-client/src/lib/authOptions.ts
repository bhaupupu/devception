import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
          const res = await fetch(`${apiUrl}/auth/login-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });
          if (!res.ok) return null;
          const data = await res.json() as { sub: string; name: string; email: string; picture: string };
          return { id: data.sub, name: data.name, email: data.email, image: data.picture };
        } catch {
          return null;
        }
      },
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

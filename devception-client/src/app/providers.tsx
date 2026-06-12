'use client';
import { SessionProvider } from 'next-auth/react';
import { CinematicProvider } from '@/components/landing/CinematicProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CinematicProvider>{children}</CinematicProvider>
    </SessionProvider>
  );
}

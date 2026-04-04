import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Press_Start_2P, Space_Mono } from 'next/font/google';

const pressStart = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-pixel', display: 'swap' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'CodeCrew — Multiplayer Coding Game',
  description: 'Code together. Deceive each other. Find the imposter.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pressStart.variable} ${spaceMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

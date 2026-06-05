import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Press_Start_2P, Space_Mono } from 'next/font/google';
import Script from 'next/script';

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Devception — Multiplayer Coding Game',
  description: 'Code together. Deceive each other. Find the imposter.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${pressStart.variable} ${spaceMono.variable}`}
    >
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8046507549517323"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>

      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
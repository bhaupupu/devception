import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Press_Start_2P, Space_Mono } from 'next/font/google';

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
  title: 'Devception — Multiplayer Social Deduction Coding Game',
  description:
    'Devception is a multiplayer social deduction coding game. Collaborate on real programming challenges with 4–8 players while secretly hunting an imposter hidden among the team. Code together. Find the imposter. Trust no one.',
  keywords: [
    'multiplayer coding game',
    'social deduction coding game',
    'coding game with friends',
    'developer party game',
    'programming challenge multiplayer',
    'coding competition game',
    'among us coding game',
    'devception',
    'developer game',
    'coding imposter game',
  ],
  metadataBase: new URL('https://devception.com'),
  authors: [{ name: 'Devception Team' }],
  creator: 'Devception',
  publisher: 'Devception',
  openGraph: {
    title: 'Devception — One Of Your Teammates Is Lying.',
    description:
      'A multiplayer social deduction coding game. Code together. Find the imposter. Trust no one.',
    url: 'https://devception.com',
    siteName: 'Devception',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devception — One Of Your Teammates Is Lying.',
    description:
      'A multiplayer social deduction coding game. Code together. Find the imposter. Trust no one.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8046507549517323"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Devception',
              description: 'Multiplayer social deduction coding game where developers collaborate on real code challenges while hunting a hidden imposter.',
              url: 'https://devception.com',
              applicationCategory: 'Game',
              genre: ['Multiplayer', 'Social Deduction', 'Coding'],
              operatingSystem: 'Web Browser',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              keywords: 'multiplayer coding game, social deduction game, coding game with friends, developer party game',
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

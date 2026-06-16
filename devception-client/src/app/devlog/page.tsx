import type { Metadata } from 'next';
import DevlogClient from '@/components/landing/DevlogClient';

export const metadata: Metadata = {
  title: 'Devlog | System Logs — Devception',
  description:
    'Patch notes, feature updates, and developer logs for Devception — the multiplayer social deduction coding game.',
  openGraph: {
    title: 'Devception Devlog — System Logs',
    description:
      'Patch notes, feature updates, and developer logs for Devception.',
    type: 'website',
  },
};

export default function DevlogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://devception.xyz/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Devlog',
        item: 'https://devception.xyz/devlog',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DevlogClient />
    </>
  );
}

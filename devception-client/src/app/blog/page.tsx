import type { Metadata } from 'next';
import BlogIndexClient from '@/components/landing/BlogIndexClient';

export const metadata: Metadata = {
  title: 'Blog | Intel Dispatch — Devception',
  description:
    'Game design, developer psychology, and technical deep-dives from the developer behind Devception — the multiplayer social deduction coding game.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Devception Blog — Intel Dispatch',
    description:
      'Insights on social deduction, developer skills, game psychology, and the future of collaborative coding.',
    type: 'website',
  },
};

export default function BlogPage() {
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
        name: 'Blog',
        item: 'https://devception.xyz/blog',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogIndexClient />
    </>
  );
}

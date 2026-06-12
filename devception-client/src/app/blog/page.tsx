import type { Metadata } from 'next';
import BlogIndexClient from '@/components/landing/BlogIndexClient';

export const metadata: Metadata = {
  title: 'Blog | Intel Dispatch — Devception',
  description:
    'Game design, developer psychology, technical deep-dives, and growth strategies from the team behind Devception — the multiplayer social deduction coding game.',
  openGraph: {
    title: 'Devception Blog — Intel Dispatch',
    description:
      'Insights on social deduction, developer skills, game psychology, and the future of collaborative coding.',
    type: 'website',
  },
};

export default function BlogPage() {
  return <BlogIndexClient />;
}

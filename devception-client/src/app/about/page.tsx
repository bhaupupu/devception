import type { Metadata } from 'next';
import AboutPageClient from '@/components/landing/AboutPageClient';

export const metadata: Metadata = {
  title: 'About — Devception | Multiplayer Coding Game',
  description: 'The story behind Devception — a multiplayer social deduction coding game built by student developers who wanted a better way to practice coding together.',
  openGraph: {
    title: 'About Devception',
    description: 'The story behind Devception — built by student developers who were tired of LeetCode and wanted a better way to code together.',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}

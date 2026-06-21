import type { Metadata } from 'next';
import ContactForm from '@/components/landing/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — Devception',
  description: 'Get in touch with the Devception team. Report bugs, ask questions, or inquire about partnerships.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Devception',
    description: 'Get in touch with the Devception team. We reply to every message within 48 hours.',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactForm />;
}

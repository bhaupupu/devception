import LandingPage from '@/components/landing/LandingPage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function Home() {
  await getServerSession(authOptions);
  return <LandingPage />;
}

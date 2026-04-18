'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (session) {
      router.replace('/lobby');
    } else {
      router.replace('/login');
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen pixel-bg flex items-center justify-center">
      <span className="pixel-font blink" style={{ fontSize: 10, color: 'var(--text-muted)' }}>LOADING...</span>
    </div>
  );
}

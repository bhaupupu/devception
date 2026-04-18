'use client';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen pixel-bg flex flex-col items-center justify-center gap-6">
      <p className="pixel-font text-2xl" style={{ color: 'var(--accent-blue)' }}>404</p>
      <p className="pixel-font" style={{ fontSize: 9, color: 'var(--text-muted)' }}>PAGE NOT FOUND</p>
      <button className="pixel-btn pixel-btn-light" onClick={() => router.push('/lobby')}>
        ← GO HOME
      </button>
    </div>
  );
}

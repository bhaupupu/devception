'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen pixel-bg flex flex-col items-center justify-center gap-6">
      <p className="pixel-font" style={{ fontSize: 9, color: '#C51111' }}>SOMETHING WENT WRONG</p>
      <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
        {error.message}
      </p>
      <button className="pixel-btn pixel-btn-light" onClick={reset}>TRY AGAIN</button>
    </div>
  );
}

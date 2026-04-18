'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <html>
      <body style={{ margin: 0, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: '#fff', fontFamily: 'monospace' }}>
          <p style={{ color: '#C51111', marginBottom: 12 }}>CRITICAL ERROR</p>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 20 }}>{error.message}</p>
          <button onClick={reset} style={{ border: '2px solid #fff', background: 'transparent', color: '#fff', padding: '8px 20px', cursor: 'pointer', fontFamily: 'monospace' }}>
            RELOAD
          </button>
        </div>
      </body>
    </html>
  );
}

'use client';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    await signIn('google', { callbackUrl: '/' });
  }

  return (
    <main className="min-h-screen pixel-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="pixel-font text-xl mb-3" style={{ color: 'var(--text-primary)', lineHeight: 2 }}>
            CODE<span style={{ color: 'var(--accent-blue)' }}>CREW</span>
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
            Code together. Find the imposter.
          </p>
        </div>

        <div className="game-panel p-8">
          <p className="pixel-font mb-8 text-center" style={{ fontSize: 9, color: 'var(--text-secondary)' }}>
            SIGN IN TO PLAY
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="pixel-btn w-full py-4 flex items-center justify-center gap-3"
            style={{
              fontSize: '11px',
              background: loading ? 'var(--bg-secondary)' : '#fff',
              color: '#1c1917',
              borderColor: 'var(--border)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {!loading && (
              <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            )}
            {loading ? 'SIGNING IN...' : 'CONTINUE WITH GOOGLE'}
          </button>

          <p className="text-center mt-6 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
            Your Google profile is used as your player identity.
          </p>
        </div>
      </motion.div>
    </main>
  );
}

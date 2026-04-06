'use client';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { api } from '@/lib/api';

type Tab = 'google' | 'email';
type EmailMode = 'signin' | 'signup';

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('google');
  const [mode, setMode] = useState<EmailMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGoogleSignIn() {
    setLoading(true);
    await signIn('google', { callbackUrl: '/' });
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await api.post('/auth/signup', { email, password, displayName });
      }
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        window.location.href = '/';
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
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
            DEV<span style={{ color: 'var(--accent-blue)' }}>CEPTION</span>
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
            Code together. Find the imposter.
          </p>
        </div>

        <div className="game-panel p-8">
          <p className="pixel-font mb-6 text-center" style={{ fontSize: 9, color: 'var(--text-secondary)' }}>
            SIGN IN TO PLAY
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['google', 'email'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className="pixel-btn flex-1 py-2"
                style={{
                  fontSize: '9px',
                  background: tab === t ? 'var(--accent-blue)' : 'transparent',
                  color: tab === t ? '#fff' : 'var(--text-muted)',
                  borderColor: tab === t ? 'var(--accent-blue)' : 'var(--border)',
                }}
              >
                {t === 'google' ? 'GOOGLE' : 'EMAIL'}
              </button>
            ))}
          </div>

          {tab === 'google' && (
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
          )}

          {tab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {mode === 'signup' && (
                <input
                  className="pixel-input w-full"
                  style={{ fontSize: '11px' }}
                  type="text"
                  placeholder="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              )}
              <input
                className="pixel-input w-full"
                style={{ fontSize: '11px' }}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="pixel-input w-full"
                style={{ fontSize: '11px' }}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />

              {error && (
                <p className="text-xs text-red-500 font-mono">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="pixel-btn pixel-btn-blue w-full py-3"
                style={{ fontSize: '11px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? '...' : mode === 'signup' ? 'CREATE ACCOUNT' : 'SIGN IN'}
              </button>

              <p className="text-center text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
                {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); }}
                  className="underline hover:opacity-70"
                  style={{ color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit' }}
                >
                  {mode === 'signup' ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  );
}

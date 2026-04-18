'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  return (
    <main className="min-h-screen pixel-bg flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#faf8f4] border-b-[3px] border-[#1c1917]">
        <span className="pixel-font text-sm" style={{ color: 'var(--text-primary)' }}>
          DEV<span style={{ color: 'var(--accent-blue)' }}>CEPTION</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>
            {user?.name ?? 'Player'}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="pixel-btn pixel-btn-light text-xs py-1 px-3"
            style={{ fontSize: '9px' }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">

        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h1 className="pixel-font text-2xl mb-3" style={{ color: 'var(--text-primary)', lineHeight: 2 }}>
            DEV<span style={{ color: 'var(--accent-blue)' }}>CEPTION</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
            Code together. Find the imposter.
          </p>
        </motion.div>

        {/* Pixel character / avatar area */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="game-panel p-6 flex flex-col items-center gap-3"
          style={{ minWidth: 200 }}
        >
          {/* Simple pixel character */}
          <div className="relative w-16 h-16 flex items-center justify-center"
            style={{ border: '3px solid var(--border)', background: '#dbeafe', fontSize: 36 }}>
            👤
          </div>
          <p className="pixel-font text-xs text-center" style={{ color: 'var(--text-primary)' }}>
            {user?.name ?? 'Player'}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
        </motion.div>

        {/* Main menu buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <button
            onClick={() => router.push('/play')}
            className="pixel-btn pixel-btn-blue w-full py-4 text-base"
            style={{ fontSize: '12px' }}
          >
            ▶  PLAY
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="pixel-btn pixel-btn-light w-full py-3"
          >
            👤  PROFILE
          </button>
          <button
            onClick={() => router.push('/shop')}
            className="pixel-btn pixel-btn-light w-full py-3"
          >
            🛒  SHOP
          </button>
        </motion.div>

        {/* Version tag */}
        <p className="pixel-font" style={{ fontSize: 8, color: 'var(--text-muted)' }}>v0.1.0 — MVP</p>
      </div>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-2 py-3 px-4 border-t-[3px] border-[#1c1917]"
        style={{ background: '#faf8f4' }}>
        <a
          href="https://github.com/sponsors/bhaupupu"
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-btn pixel-btn-light flex items-center gap-2 px-4 py-1"
          style={{ fontSize: '9px', borderColor: '#e879a0', color: '#e879a0', boxShadow: '3px 3px 0 #e879a0' }}
        >
          ♥ SPONSOR THIS PROJECT
        </a>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}>
          Support keeps this free
        </p>
      </footer>
    </main>
  );
}

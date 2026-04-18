'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { LANGUAGES, SKILL_LEVELS } from '@/lib/constants';

type View = 'choose' | 'create' | 'join';

export default function PlayPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const token = (session as { accessToken?: string })?.accessToken;

  const [view, setView] = useState<View>('choose');
  const [language, setLanguage] = useState('javascript');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreateRoom() {
    if (!token) { setError('Not signed in'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await api.post<{ roomCode: string }>('/games/create', { language, skillLevel, maxPlayers }, token);
      router.push(`/lobby/${res.roomCode}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create room');
      setLoading(false);
    }
  }

  function handleJoinRoom() {
    const code = roomCodeInput.trim().toUpperCase();
    if (!code) { setError('Enter a room code'); return; }
    router.push(`/lobby/${code}`);
  }

  return (
    <main className="min-h-screen pixel-bg flex flex-col">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-6 py-3 bg-[#faf8f4] border-b-[3px] border-[#1c1917]">
        <button
          onClick={() => view === 'choose' ? router.push('/lobby') : setView('choose')}
          className="pixel-btn pixel-btn-light py-1 px-3"
          style={{ fontSize: '9px' }}
        >
          ← BACK
        </button>
        <span className="pixel-font text-xs" style={{ color: 'var(--text-primary)' }}>
          {view === 'choose' ? 'PLAY' : view === 'create' ? 'CREATE ROOM' : 'JOIN ROOM'}
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">

          {/* Choose mode */}
          {view === 'choose' && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 w-full max-w-sm"
            >
              <h2 className="pixel-font text-sm text-center" style={{ lineHeight: 2 }}>SELECT MODE</h2>

              <button
                onClick={() => setView('create')}
                className="pixel-btn pixel-btn-green w-full py-5"
                style={{ fontSize: '11px' }}
              >
                🏠  CREATE ROOM
              </button>

              <button
                onClick={() => setView('join')}
                className="pixel-btn pixel-btn-blue w-full py-5"
                style={{ fontSize: '11px' }}
              >
                🔗  JOIN ROOM
              </button>

              <p className="text-xs text-center" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
                Create a room and share the code with friends, or enter a code to join an existing room.
              </p>
            </motion.div>
          )}

          {/* Create room form */}
          {view === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="game-panel p-8 w-full max-w-md"
            >
              <h2 className="pixel-font text-xs mb-6" style={{ lineHeight: 2 }}>ROOM SETTINGS</h2>

              {/* Language */}
              <div className="mb-5">
                <label className="pixel-font block mb-3" style={{ fontSize: 9, color: 'var(--text-secondary)' }}>
                  LANGUAGE
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setLanguage(l.value)}
                      className="pixel-btn py-2"
                      style={{
                        fontSize: '9px',
                        background: language === l.value ? 'var(--accent-blue)' : 'var(--bg-card)',
                        color: language === l.value ? '#fff' : 'var(--text-primary)',
                        boxShadow: language === l.value ? '3px 3px 0 #1d4ed8' : 'var(--pixel-shadow-sm)',
                      }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill level */}
              <div className="mb-5">
                <label className="pixel-font block mb-3" style={{ fontSize: 9, color: 'var(--text-secondary)' }}>
                  DIFFICULTY
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SKILL_LEVELS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSkillLevel(s.value)}
                      className="pixel-btn py-2"
                      style={{
                        fontSize: '9px',
                        background: skillLevel === s.value
                          ? (s.value === 'beginner' ? 'var(--accent-green)' : s.value === 'intermediate' ? 'var(--accent-yellow)' : 'var(--accent-red)')
                          : 'var(--bg-card)',
                        color: skillLevel === s.value ? '#fff' : 'var(--text-primary)',
                        boxShadow: skillLevel === s.value ? '3px 3px 0 #111' : 'var(--pixel-shadow-sm)',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max players */}
              <div className="mb-6">
                <label className="pixel-font block mb-3" style={{ fontSize: 9, color: 'var(--text-secondary)' }}>
                  MAX PLAYERS: {maxPlayers}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMaxPlayers((p) => Math.max(4, p - 1))}
                    className="pixel-btn pixel-btn-light"
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                  >
                    −
                  </button>
                  <div className="flex-1 h-3 border-2 border-[#1c1917] bg-white relative" style={{ boxShadow: 'inset 1px 1px 0 #d6d0c4' }}>
                    <div
                      className="h-full"
                      style={{
                        width: `${((maxPlayers - 4) / 6) * 100}%`,
                        background: 'var(--accent-blue)',
                        transition: 'width 0.1s',
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setMaxPlayers((p) => Math.min(10, p + 1))}
                    className="pixel-btn pixel-btn-light"
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                  >
                    +
                  </button>
                </div>
                <div className="flex justify-between mt-1">
                  <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'Press Start 2P, monospace' }}>4</span>
                  <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'Press Start 2P, monospace' }}>10</span>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 mb-4 font-mono">{error}</p>
              )}

              <button
                onClick={handleCreateRoom}
                disabled={loading}
                className="pixel-btn pixel-btn-green w-full py-4"
                style={{ fontSize: '11px' }}
              >
                {loading ? 'CREATING...' : '🚀  CREATE ROOM'}
              </button>
            </motion.div>
          )}

          {/* Join room form */}
          {view === 'join' && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="game-panel p-8 w-full max-w-sm"
            >
              <h2 className="pixel-font text-xs mb-6" style={{ lineHeight: 2 }}>ENTER ROOM CODE</h2>

              <input
                className="pixel-input mb-2 uppercase tracking-widest text-center"
                style={{ fontSize: 20, letterSpacing: '0.25em', fontFamily: 'Press Start 2P, monospace' }}
                placeholder="XXXXXX"
                maxLength={6}
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
              />

              {error && (
                <p className="text-sm text-red-600 mb-4 font-mono">{error}</p>
              )}

              <button
                onClick={handleJoinRoom}
                className="pixel-btn pixel-btn-blue w-full py-4 mt-4"
                style={{ fontSize: '11px' }}
              >
                JOIN →
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}

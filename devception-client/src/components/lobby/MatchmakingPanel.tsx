'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { LANGUAGES, SKILL_LEVELS } from '@/lib/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Props {
  onJoin: (skillLevel: string, language: string) => void;
  onLeave: () => void;
  status: 'idle' | 'queued' | 'matched' | 'error';
  position: number;
  total: number;
  error: string | null;
}

export function MatchmakingPanel({ onJoin, onLeave, status, position, total, error }: Props) {
  const [skill, setSkill] = useState('beginner');
  const [lang, setLang] = useState('javascript');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="game-panel p-8 max-w-md w-full"
    >
      <h2 className="text-2xl font-bold mb-6 gradient-text">Find a Match</h2>

      {status === 'idle' && (
        <>
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Skill Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SKILL_LEVELS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSkill(s.value)}
                  className="py-2 px-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: skill === s.value ? 'var(--accent-blue)' : 'var(--bg-hover)',
                    color: skill === s.value ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: skill === s.value ? 'var(--accent-blue)' : 'var(--border)',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLang(l.value)}
                  className="py-2 px-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: lang === l.value ? 'var(--accent-purple)' : 'var(--bg-hover)',
                    color: lang === l.value ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: lang === l.value ? 'var(--accent-purple)' : 'var(--border)',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 mb-4">{error}</p>
          )}

          <Button size="lg" className="w-full" onClick={() => onJoin(skill, lang)}>
            Find Match
          </Button>
        </>
      )}

      {status === 'queued' && (
        <div className="text-center py-8">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex justify-center mb-6"
          >
            <div className="relative w-24 h-24 rounded-full border-4 flex items-center justify-center border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <LoadingSpinner size={32} />
              <motion.div 
                animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.5, 2] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-blue-400"
              />
            </div>
          </motion.div>
          <h3 className="text-xl font-bold mb-2">Searching for match...</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Position {position} of {total} in queue
          </p>
          
          <div className="mb-8 w-full max-w-[250px] mx-auto">
            <ProgressBar 
              value={total > 0 ? Math.max(10, ((total - position + 1) / total) * 100) : 10} 
              color="var(--accent-blue)" 
              height={10} 
            />
          </div>

          <button
            onClick={onLeave}
            className="pixel-btn pixel-btn-light px-6 py-2 text-xs"
          >
            CANCEL MATCHMAKING
          </button>
        </div>
      )}
    </motion.div>
  );
}

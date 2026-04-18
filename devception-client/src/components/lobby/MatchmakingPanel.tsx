'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { LANGUAGES, SKILL_LEVELS } from '@/lib/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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
        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            <LoadingSpinner size={40} />
          </div>
          <p className="font-semibold mb-1">Searching for players...</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Position {position} of {total} in queue
          </p>
          <button
            onClick={onLeave}
            className="mt-6 text-sm underline"
            style={{ color: 'var(--text-muted)' }}
          >
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
}

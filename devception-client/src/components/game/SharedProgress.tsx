'use client';
import { motion } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Timer } from '@/components/ui/Timer';
import { GameState } from '@/types/game';

interface Props {
  game: GameState;
  myRole: string | null;
}

export function SharedProgress({ game, myRole }: Props) {
  const completedTasks = game.tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="flex items-center gap-4 px-4 py-2 game-panel">
      {/* Timer */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Time</span>
        <Timer remainingMs={game.timer.remainingMs} />
      </div>

      <div className="w-px h-6" style={{ background: 'var(--border)' }} />

      {/* Progress */}
      <div className="flex-1 flex items-center gap-3">
        <span className="text-xs uppercase tracking-wide whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
          Progress
        </span>
        <ProgressBar
          value={game.sharedProgress}
          color={game.sharedProgress >= 80 ? '#22c55e' : '#4f8ef7'}
          height={10}
          showLabel
        />
      </div>

      <div className="w-px h-6" style={{ background: 'var(--border)' }} />

      {/* Tasks */}
      <div className="text-right">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tasks</p>
        <p className="text-sm font-bold">
          {completedTasks}/{game.tasks.length}
        </p>
      </div>

      {/* Role badge */}
      <div className="w-px h-6" style={{ background: 'var(--border)' }} />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="px-3 py-1 rounded-full text-xs font-bold"
        style={{
          background: myRole === 'imposter' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
          color: myRole === 'imposter' ? '#ef4444' : '#22c55e',
          border: `1px solid ${myRole === 'imposter' ? '#ef4444' : '#22c55e'}`,
        }}
      >
        {myRole === 'imposter' ? '😈 IMPOSTER' : '👨‍💻 CODER'}
      </motion.div>
    </div>
  );
}

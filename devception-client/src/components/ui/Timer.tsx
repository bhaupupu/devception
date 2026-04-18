'use client';

interface TimerProps {
  remainingMs: number;
}

export function Timer({ remainingMs }: TimerProps) {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isLow = totalSeconds < 60;

  return (
    <span
      className="font-mono font-bold tabular-nums text-lg"
      style={{ color: isLow ? 'var(--accent-red)' : 'var(--text-primary)' }}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
}

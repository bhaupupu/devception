'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GameState, PlayerState } from '@/types/game';
import { AppSocket } from '@/lib/socket';

interface Props {
  game: GameState;
  myUserId: string;
  myRole: 'good-coder' | 'imposter' | null;
  socket: AppSocket | null;
  onPlayAgain: () => void;
}

const XP_LEVEL_CAP = 500; // XP shown per "level bar"

function XpBar({ xp, isWinner }: { xp: number; isWinner: boolean }) {
  const [width, setWidth] = useState(0);
  const pct = Math.min(100, (xp / XP_LEVEL_CAP) * 100);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="mt-1">
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 8, background: 'var(--bg-secondary, #1a1a2e)' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: isWinner
              ? 'linear-gradient(90deg, #22c55e, #86efac)'
              : 'linear-gradient(90deg, #3b82f6, #93c5fd)',
            borderRadius: 9999,
          }}
        />
      </div>
    </div>
  );
}

function calcXp(player: PlayerState, winner: GameState['winner']): number {
  const isWinner =
    (winner === 'good-coders' && player.role === 'good-coder') ||
    (winner === 'imposters' && player.role === 'imposter');
  return 50 + player.tasksCompleted.length * 15 + (isWinner ? 100 : 0);
}

export function GameOverScreen({ game, myUserId, myRole: _myRole, socket, onPlayAgain }: Props) {
  const winner = game.winner;
  const myPlayer = game.players.find((p) => p.userId === myUserId);
  const iWon = myPlayer
    ? (winner === 'good-coders' && myPlayer.role === 'good-coder') ||
      (winner === 'imposters' && myPlayer.role === 'imposter')
    : false;
  const myXp = myPlayer ? calcXp(myPlayer, winner) : 0;

  const handlePlayAgain = () => {
    socket?.emit('room:reset', { roomCode: game.roomCode });
    onPlayAgain();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)' }}
    >
      {/* Winner banner */}
      <motion.div
        initial={{ scale: 0.7, y: -30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="text-center mb-8"
      >
        <p className="text-6xl mb-3">{iWon ? '🏆' : '💀'}</p>
        <h1
          className="pixel-font text-3xl"
          style={{ color: iWon ? '#22c55e' : '#ef4444', letterSpacing: '0.1em' }}
        >
          {iWon ? 'YOU WIN!' : 'YOU LOSE!'}
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          {winner === 'good-coders' ? 'Good Coders fixed the code!' : 'Imposters ruined everything!'}
        </p>
      </motion.div>

      {/* My XP */}
      {myPlayer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="game-panel p-5 mb-6 w-full max-w-sm text-center"
        >
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
            XP EARNED THIS GAME
          </p>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-4xl font-black mb-2"
            style={{ color: iWon ? '#22c55e' : '#3b82f6' }}
          >
            +{myXp}
          </motion.p>
          <XpBar xp={myXp} isWinner={iWon} />
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
            {myPlayer.tasksCompleted.length} tasks · {myPlayer.role} · {iWon ? 'winner' : 'eliminated'}
          </p>
        </motion.div>
      )}

      {/* All players */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm space-y-2 mb-8"
      >
        {[...game.players]
          .sort((a, b) => calcXp(b, winner) - calcXp(a, winner))
          .map((p, i) => {
            const pXp = calcXp(p, winner);
            const pWon =
              (winner === 'good-coders' && p.role === 'good-coder') ||
              (winner === 'imposters' && p.role === 'imposter');
            return (
              <motion.div
                key={p.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  background: p.userId === myUserId ? 'rgba(59,130,246,0.15)' : 'var(--bg-card, #0d0d1a)',
                  border: `1px solid ${p.userId === myUserId ? '#3b82f6' : 'var(--border)'}`,
                }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: p.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                    {p.displayName}{p.userId === myUserId ? ' (you)' : ''}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
                    {p.role} · {p.tasksCompleted.length} tasks
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="text-sm font-bold"
                    style={{ color: pWon ? '#22c55e' : '#ef4444' }}
                  >
                    +{pXp} XP
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {pWon ? 'WIN' : 'LOSS'}
                  </p>
                </div>
              </motion.div>
            );
          })}
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-3 w-full max-w-sm"
      >
        <button
          onClick={handlePlayAgain}
          className="pixel-btn pixel-btn-green flex-1 py-3"
          style={{ fontSize: '11px' }}
        >
          ▶  PLAY AGAIN
        </button>
        <button
          onClick={() => { window.location.href = '/lobby'; }}
          className="pixel-btn flex-1 py-3"
          style={{ fontSize: '11px' }}
        >
          MAIN MENU
        </button>
      </motion.div>
    </motion.div>
  );
}

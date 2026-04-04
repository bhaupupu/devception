'use client';
import { motion } from 'framer-motion';
import { PlayerSlot } from './PlayerSlot';
import { GameState } from '@/types/game';

interface Props {
  game: GameState;
  myUserId: string;
  onReady: () => void;
  onForceStart: () => void;
  onSettingsChange: (key: keyof GameState['settings'], value: number) => void;
  isReady: boolean;
  isAdmin: boolean;
}

const COOLDOWN_OPTIONS = [
  { label: '30s', value: 30000 },
  { label: '45s', value: 45000 },
  { label: '1 min', value: 60000 },
  { label: '90s', value: 90000 },
];

const TASK_OPTIONS = [3, 5, 7, 10];

export function WaitingRoom({ game, myUserId: _myUserId, onReady, onForceStart, onSettingsChange, isReady, isAdmin }: Props) {
  const slots = Array.from({ length: game.maxPlayers ?? 8 }, (_, i) => game.players[i] ?? null);
  const connectedCount = game.players.filter((p) => p.isConnected).length;
  const readyCount = game.players.filter((p) => p.readyToStart).length;
  const maxPlayers = game.maxPlayers ?? 8;

  const settings = game.settings ?? { imposterCount: 1, tasksPerPlayer: 5, impostorCooldownMs: 60000 };

  function copyCode() {
    navigator.clipboard.writeText(game.roomCode).catch(() => {});
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full flex gap-6 items-start ${isAdmin ? 'max-w-4xl' : 'max-w-lg'}`}
    >
      {/* Left column: room + players */}
      <div className="flex-1 min-w-0">

      {/* Room code card */}
      <div className="game-panel p-6 mb-4 text-center">
        <p className="pixel-font mb-2" style={{ fontSize: 9, color: 'var(--text-muted)' }}>ROOM CODE</p>
        <div
          className="pixel-font text-3xl tracking-widest cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: 'var(--accent-blue)', letterSpacing: '0.3em' }}
          onClick={copyCode}
          title="Click to copy"
        >
          {game.roomCode}
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
          Share this code with friends · click to copy
        </p>
      </div>

      {/* Players */}
      <div className="game-panel p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="pixel-font" style={{ fontSize: 9 }}>PLAYERS</span>
          <span className="text-sm font-bold" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
            {connectedCount}/{maxPlayers}
          </span>
        </div>

        <div className="space-y-2 mb-5">
          {slots.map((player, i) => (
            <PlayerSlot key={i} player={player} index={i} />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs mb-4"
          style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
          <span>{readyCount}/{connectedCount} ready</span>
          <span>
            {connectedCount < 4
              ? `Need ${4 - connectedCount} more player(s) to start`
              : connectedCount >= maxPlayers
              ? 'Lobby full — all players ready up!'
              : 'Waiting for players or admin to start'}
          </span>
        </div>

        {/* Ready up button */}
        <button
          onClick={onReady}
          disabled={isReady}
          className={`pixel-btn w-full py-4 mb-2 ${isReady ? 'pixel-btn-light' : 'pixel-btn-green'}`}
          style={{ fontSize: '11px', opacity: isReady ? 0.6 : 1, cursor: isReady ? 'not-allowed' : 'pointer' }}
        >
          {isReady ? '✓  READY!' : '▶  READY UP'}
        </button>

        {/* Admin force-start */}
        {isAdmin && (
          <button
            onClick={onForceStart}
            className="pixel-btn pixel-btn-light w-full py-3"
            style={{ fontSize: '10px', color: 'var(--accent-blue)', borderColor: 'var(--accent-blue)' }}
          >
            ⚡ FORCE START
          </button>
        )}
      </div>

      </div>{/* end left column */}

      {/* Right column: Game Settings — admin only */}
      {isAdmin && (
        <div className="w-72 flex-shrink-0">
          <div className="game-panel p-5">
            <p className="pixel-font mb-4" style={{ fontSize: 9 }}>GAME SETTINGS</p>

            <div className="space-y-5">
              {/* Imposter Count */}
              <div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
                  Imposters
                </p>
                <div className="flex gap-2">
                  {[1, 2].map((n) => (
                    <button
                      key={n}
                      onClick={() => onSettingsChange('imposterCount', n)}
                      className="pixel-btn flex-1"
                      style={{
                        fontSize: '10px',
                        padding: '6px 0',
                        background: settings.imposterCount === n ? '#C51111' : 'transparent',
                        color: settings.imposterCount === n ? '#fff' : 'var(--text-muted)',
                        borderColor: settings.imposterCount === n ? '#C51111' : 'var(--border)',
                      }}
                    >
                      {n} imposter{n > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tasks per player */}
              <div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
                  Tasks / Player
                </p>
                <div className="flex gap-2">
                  {TASK_OPTIONS.map((n) => (
                    <button
                      key={n}
                      onClick={() => onSettingsChange('tasksPerPlayer', n)}
                      className="pixel-btn flex-1"
                      style={{
                        fontSize: '10px',
                        padding: '6px 0',
                        background: settings.tasksPerPlayer === n ? '#132ED1' : 'transparent',
                        color: settings.tasksPerPlayer === n ? '#fff' : 'var(--text-muted)',
                        borderColor: settings.tasksPerPlayer === n ? '#132ED1' : 'var(--border)',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sabotage cooldown */}
              <div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
                  Sabotage Cooldown
                </p>
                <div className="flex flex-wrap gap-2">
                  {COOLDOWN_OPTIONS.map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => onSettingsChange('impostorCooldownMs', value)}
                      className="pixel-btn flex-1"
                      style={{
                        fontSize: '10px',
                        padding: '6px 0',
                        background: settings.impostorCooldownMs === value ? '#EF7D0E' : 'transparent',
                        color: settings.impostorCooldownMs === value ? '#fff' : 'var(--text-muted)',
                        borderColor: settings.impostorCooldownMs === value ? '#EF7D0E' : 'var(--border)',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

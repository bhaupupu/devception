'use client';
import { motion } from 'framer-motion';
import { useImposter } from '@/hooks/useImposter';
import { AppSocket } from '@/lib/socket';
import { PlayerState } from '@/types/game';

interface Props {
  socket: AppSocket | null;
  roomCode: string;
  players: PlayerState[];
  myUserId: string;
}

const SHARED_COOLDOWN_MS = 45000; // matches server default

export function ImposterActions({ socket, roomCode, players, myUserId }: Props) {
  const { cooldowns, injectBug, blurScreen, variableShadow, lockKeyboard } = useImposter(socket, roomCode);

  const others = players.filter((p) => p.userId !== myUserId && p.isAlive && p.isConnected);

  // All abilities share the same cooldown — read from bug (they're always equal)
  const cooldownMs = cooldowns.bug;
  const isReady = cooldownMs <= 0;
  const secs = Math.ceil(cooldownMs / 1000);
  const drainPct = isReady ? 0 : ((SHARED_COOLDOWN_MS - cooldownMs) / SHARED_COOLDOWN_MS) * 100;

  return (
    <div className="game-panel p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#ef4444' }}>
          😈 Sabotage
        </p>
        {!isReady && (
          <span className="text-xs font-mono font-bold" style={{ color: '#f97316' }}>
            {secs}s
          </span>
        )}
        {isReady && (
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-xs font-bold"
            style={{ color: '#ef4444' }}
          >
            READY
          </motion.span>
        )}
      </div>

      {/* Shared cooldown bar */}
      <div className="rounded-full overflow-hidden" style={{ height: 3, background: 'var(--bg-hover)' }}>
        <motion.div
          animate={{ width: isReady ? '100%' : `${drainPct}%` }}
          transition={{ duration: 0.3 }}
          style={{
            height: '100%',
            background: isReady ? '#ef4444' : 'linear-gradient(90deg, #ef4444, #f97316)',
            borderRadius: 9999,
          }}
        />
      </div>

      {/* Bug inject — server-side mutation picker */}
      <SabotageButton
        label="Inject Bug"
        icon="🐛"
        description="Quietly mutates a comparator, boundary, or return"
        isReady={isReady}
        onClick={injectBug}
      />

      {/* Screen blur */}
      <div>
        <p className="text-xs mb-1 px-0.5" style={{ color: 'var(--text-muted)' }}>Blur Screen</p>
        <div className="grid grid-cols-2 gap-1">
          {others.map((p) => (
            <SabotageButton
              key={`blur-${p.userId}`}
              label={p.displayName.slice(0, 8)}
              icon="😵"
              isReady={isReady}
              onClick={() => blurScreen(p.userId)}
              small
            />
          ))}
        </div>
      </div>

      {/* Lock keyboard */}
      <div>
        <p className="text-xs mb-1 px-0.5" style={{ color: 'var(--text-muted)' }}>Lock Keyboard <span style={{ color: '#475569' }}>(15s)</span></p>
        <div className="grid grid-cols-2 gap-1">
          {others.map((p) => (
            <SabotageButton
              key={`lock-${p.userId}`}
              label={p.displayName.slice(0, 8)}
              icon="🔒"
              isReady={isReady}
              onClick={() => lockKeyboard(p.userId)}
              small
            />
          ))}
        </div>
      </div>

      {/* Variable Shadow — replaces the old False Hint sabotage */}
      <SabotageButton
        label="Variable Shadow"
        icon="👻"
        description="Wipes a variable mid-function with a hidden re-assignment"
        isReady={isReady}
        onClick={variableShadow}
      />
    </div>
  );
}

function SabotageButton({
  label, icon, description, isReady, onClick, small,
}: {
  label: string; icon: string; description?: string; isReady: boolean; onClick: () => void; small?: boolean;
}) {
  return (
    <motion.button
      whileTap={isReady ? { scale: 0.95 } : {}}
      onClick={isReady ? onClick : undefined}
      className={`w-full flex items-center gap-1.5 rounded-lg transition-all ${small ? 'px-2 py-1.5' : 'px-3 py-2'}`}
      style={{
        background: isReady ? 'rgba(239,68,68,0.12)' : 'var(--bg-hover)',
        border: `1px solid ${isReady ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`,
        cursor: isReady ? 'pointer' : 'not-allowed',
        opacity: isReady ? 1 : 0.5,
      }}
    >
      <span style={{ fontSize: small ? 12 : 14 }}>{icon}</span>
      <div className="flex-1 min-w-0 text-left">
        <p
          className="font-medium leading-tight truncate"
          style={{ fontSize: small ? 10 : 11, color: isReady ? '#ef4444' : 'var(--text-muted)' }}
        >
          {label}
        </p>
        {description && !small && (
          <p className="truncate" style={{ fontSize: 9, color: 'var(--text-muted)' }}>{description}</p>
        )}
      </div>
    </motion.button>
  );
}

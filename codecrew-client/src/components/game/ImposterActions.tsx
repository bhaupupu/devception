'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useImposter } from '@/hooks/useImposter';
import { AppSocket } from '@/lib/socket';
import { PlayerState } from '@/types/game';

interface Props {
  socket: AppSocket | null;
  roomCode: string;
  players: PlayerState[];
  myUserId: string;
  currentLine: number;
}

export function ImposterActions({ socket, roomCode, players, myUserId, currentLine }: Props) {
  const { cooldowns, injectBug, blurScreen, sendHint, lockKeyboard } = useImposter(socket, roomCode);
  const [hintInput, setHintInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  const others = players.filter((p) => p.userId !== myUserId && p.isAlive && p.isConnected);

  return (
    <div className="game-panel p-3 space-y-2">
      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#ef4444' }}>
        😈 Sabotage
      </p>

      {/* Bug inject */}
      <ActionButton
        label="Inject Bug"
        icon="🐛"
        cooldown={cooldowns.bug}
        onClick={() => injectBug(currentLine, '  throw new Error("Sabotaged!");')}
      />

      {/* Screen blur */}
      <div>
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Blur Screen</p>
        <div className="grid grid-cols-2 gap-1">
          {others.map((p) => (
            <ActionButton
              key={`blur-${p.userId}`}
              label={p.displayName.slice(0, 8)}
              icon="😵"
              cooldown={cooldowns.blur}
              onClick={() => blurScreen(p.userId)}
              small
            />
          ))}
        </div>
      </div>

      {/* Lock keyboard */}
      <div>
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Lock Keyboard (15s)</p>
        <div className="grid grid-cols-2 gap-1">
          {others.map((p) => (
            <ActionButton
              key={`lock-${p.userId}`}
              label={p.displayName.slice(0, 8)}
              icon="🔒"
              cooldown={cooldowns.lock}
              onClick={() => lockKeyboard(p.userId)}
              small
            />
          ))}
        </div>
      </div>

      {/* Misleading hint */}
      {showHint ? (
        <div className="space-y-1">
          <input
            value={hintInput}
            onChange={(e) => setHintInput(e.target.value)}
            placeholder="Misleading hint..."
            maxLength={200}
            className="w-full px-2 py-1.5 rounded text-xs"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <div className="flex gap-1">
            <ActionButton
              label="Send"
              icon="💬"
              cooldown={cooldowns.hint}
              onClick={() => { sendHint(hintInput); setHintInput(''); setShowHint(false); }}
              small
            />
            <button
              onClick={() => setShowHint(false)}
              className="flex-1 py-1.5 rounded text-xs"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <ActionButton
          label="Send False Hint"
          icon="💬"
          cooldown={cooldowns.hint}
          onClick={() => setShowHint(true)}
        />
      )}
    </div>
  );
}

function ActionButton({
  label, icon, cooldown, onClick, small,
}: {
  label: string; icon: string; cooldown: number; onClick: () => void; small?: boolean;
}) {
  const ready = cooldown <= 0;
  const secs = Math.ceil(cooldown / 1000);

  return (
    <motion.button
      whileTap={ready ? { scale: 0.95 } : {}}
      onClick={ready ? onClick : undefined}
      className={`w-full flex items-center justify-center gap-1 rounded font-medium transition-all ${small ? 'py-1 text-xs' : 'py-1.5 text-xs'}`}
      style={{
        background: ready ? 'rgba(239,68,68,0.15)' : 'var(--bg-hover)',
        border: `1px solid ${ready ? '#ef4444' : 'var(--border)'}`,
        color: ready ? '#ef4444' : 'var(--text-muted)',
        cursor: ready ? 'pointer' : 'not-allowed',
      }}
    >
      {icon} {ready ? label : `${secs}s`}
    </motion.button>
  );
}

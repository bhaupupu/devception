'use client';
import { PlayerState } from '@/types/game';
import { Avatar } from '@/components/ui/Avatar';
import { useEditorStore } from '@/store/editorStore';
import { useGameStore } from '@/store/gameStore';

interface Props {
  players: PlayerState[];
  myUserId: string;
}

function countPattern(text: string, pattern: string): number {
  let count = 0;
  let idx = 0;
  while ((idx = text.indexOf(pattern, idx)) !== -1) {
    count++;
    idx += pattern.length;
  }
  return count;
}

export function PlayerList({ players, myUserId }: Props) {
  const { code } = useEditorStore();
  const { game } = useGameStore();
  const language = game?.language ?? 'javascript';

  // Bug / TODO patterns depend on language
  const bugPattern = language === 'python' ? '# BUG' : '// BUG';
  const todoPattern = language === 'python' ? '# your code here' : '// your code here';

  const bugsLeft = code ? countPattern(code, bugPattern) : null;
  const todosLeft = code ? countPattern(code, todoPattern) : null;
  const allFixed = code && bugsLeft === 0 && todosLeft === 0;

  return (
    <div className="game-panel h-full flex flex-col overflow-hidden">
      {/* Players header */}
      <div className="p-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Players ({players.filter((p) => p.isConnected).length})
        </h3>
      </div>

      {/* Player list */}
      <div className="overflow-y-auto p-2 space-y-1" style={{ flex: '0 0 auto', maxHeight: '50%' }}>
        {players.map((player) => (
          <div
            key={player.userId}
            className="flex items-center gap-2 p-2 rounded-lg"
            style={{
              background: player.userId === myUserId ? 'var(--bg-hover)' : 'transparent',
              opacity: player.isAlive && player.isConnected ? 1 : 0.4,
            }}
          >
            <Avatar src={player.avatarUrl} name={player.displayName} color={player.color} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {player.displayName}
                {player.userId === myUserId && (
                  <span className="ml-1 text-xs" style={{ color: 'var(--text-muted)' }}>(you)</span>
                )}
              </p>
              {!player.isAlive && (
                <p className="text-xs" style={{ color: 'var(--accent-red)' }}>Ejected</p>
              )}
            </div>
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: player.isConnected && player.isAlive ? '#22c55e' : '#475569' }}
            />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="flex-shrink-0" style={{ height: 1, background: 'var(--border)' }} />

      {/* Code checks panel */}
      <div className="flex-1 overflow-y-auto p-3">
        <h4
          className="text-xs uppercase tracking-wider font-bold mb-3"
          style={{ color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}
        >
          Code Checks
        </h4>

        {code === null || code === undefined ? (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Waiting for game…</p>
        ) : allFixed ? (
          <div
            className="p-2 rounded-lg text-center text-xs"
            style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', color: '#22c55e' }}
          >
            🎉 All bugs fixed! Victory incoming…
          </div>
        ) : (
          <div className="space-y-2">
            {/* Bugs remaining */}
            <div
              className="flex items-center justify-between p-2 rounded-lg"
              style={{
                background: (bugsLeft ?? 0) === 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${(bugsLeft ?? 0) === 0 ? '#22c55e' : '#ef4444'}`,
              }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: (bugsLeft ?? 0) === 0 ? '#22c55e' : '#ef4444' }}>
                  {(bugsLeft ?? 0) === 0 ? '✓' : '✗'}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
                  Fix <code className="text-xs">{bugPattern}</code> bugs
                </span>
              </div>
              {(bugsLeft ?? 0) > 0 && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ background: '#ef4444', color: '#fff', fontFamily: 'Space Mono, monospace' }}
                >
                  {bugsLeft}
                </span>
              )}
            </div>

            {/* TODOs remaining */}
            <div
              className="flex items-center justify-between p-2 rounded-lg"
              style={{
                background: (todosLeft ?? 0) === 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${(todosLeft ?? 0) === 0 ? '#22c55e' : '#ef4444'}`,
              }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: (todosLeft ?? 0) === 0 ? '#22c55e' : '#ef4444' }}>
                  {(todosLeft ?? 0) === 0 ? '✓' : '✗'}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
                  Complete all TODOs
                </span>
              </div>
              {(todosLeft ?? 0) > 0 && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{ background: '#ef4444', color: '#fff', fontFamily: 'Space Mono, monospace' }}
                >
                  {todosLeft}
                </span>
              )}
            </div>

            {/* Helper tip */}
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Fix all marked bugs &amp; complete all TODOs to win via main code.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

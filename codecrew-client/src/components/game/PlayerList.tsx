import { motion } from 'framer-motion';
import { MainTestCaseState, PlayerState } from '@/types/game';
import { Avatar } from '@/components/ui/Avatar';

interface Props {
  players: PlayerState[];
  myUserId: string;
  testCases?: MainTestCaseState[];
}

export function PlayerList({ players, myUserId, testCases = [] }: Props) {
  const passedCount = testCases.filter(tc => tc.passed).length;
  const total = testCases.length;
  const progressPct = total > 0 ? (passedCount / total) * 100 : 0;
  const allPassed = total > 0 && passedCount === total;

  return (
    <div className="game-panel h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Players ({players.filter((p) => p.isConnected).length})
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
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

        {total > 0 && (
          <div className="mt-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            {/* Header + counter */}
            <div className="flex items-center justify-between px-2 mb-2">
              <p className="font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                Main Code Tests
              </p>
              <span
                className="font-mono font-bold"
                style={{ fontSize: '10px', color: allPassed ? '#22c55e' : 'var(--text-muted)' }}
              >
                {passedCount}/{total}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mx-2 mb-2 rounded-full overflow-hidden" style={{ height: 4, background: 'var(--bg-secondary, #1a1a2e)' }}>
              <motion.div
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: allPassed ? '#22c55e' : 'linear-gradient(90deg, #3b82f6, #22c55e)',
                  borderRadius: 9999,
                }}
              />
            </div>

            {/* Test case list */}
            {testCases.map((tc) => (
              <motion.div
                key={tc.id}
                layout
                className="flex items-start gap-2 px-2 py-1 rounded"
                style={{ background: tc.passed ? 'rgba(34,197,94,0.06)' : 'transparent' }}
              >
                <span
                  className="flex-shrink-0 font-bold mt-0.5"
                  style={{ fontSize: '11px', color: tc.passed ? '#22c55e' : '#475569', minWidth: 12 }}
                >
                  {tc.passed ? '✓' : '○'}
                </span>
                <span
                  className="leading-snug"
                  style={{
                    fontSize: '10px',
                    color: tc.passed ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: tc.passed ? 500 : 400,
                  }}
                >
                  {tc.description}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

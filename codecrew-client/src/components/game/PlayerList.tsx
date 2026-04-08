import { MainTestCaseState, PlayerState } from '@/types/game';
import { Avatar } from '@/components/ui/Avatar';

interface Props {
  players: PlayerState[];
  myUserId: string;
  testCases?: MainTestCaseState[];
}

export function PlayerList({ players, myUserId, testCases = [] }: Props) {
  const passedCount = testCases.filter(tc => tc.passed).length;

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

        {testCases.length > 0 && (
          <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between px-2 mb-2">
              <p
                className="font-bold uppercase tracking-wider"
                style={{ color: 'var(--text-muted)', fontSize: '9px' }}
              >
                Main Code Tests
              </p>
              <span
                className="font-mono"
                style={{
                  fontSize: '9px',
                  color: passedCount === testCases.length ? 'var(--accent-green)' : 'var(--text-muted)',
                }}
              >
                {passedCount}/{testCases.length}
              </span>
            </div>
            {testCases.map((tc) => (
              <div key={tc.id} className="flex items-start gap-1.5 px-2 py-1">
                <span
                  className="flex-shrink-0 font-bold mt-0.5"
                  style={{
                    fontSize: '10px',
                    color: tc.passed ? 'var(--accent-green)' : 'var(--text-muted)',
                  }}
                >
                  {tc.passed ? '✓' : '○'}
                </span>
                <span
                  className="leading-tight"
                  style={{
                    fontSize: '9px',
                    color: tc.passed ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  {tc.description}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

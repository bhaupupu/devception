import { PlayerState } from '@/types/game';
import { Avatar } from '@/components/ui/Avatar';

interface Props {
  players: PlayerState[];
  myUserId: string;
}

export function PlayerList({ players, myUserId }: Props) {
  return (
    <div className="game-panel h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
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
              className="w-2 h-2 rounded-full"
              style={{ background: player.isConnected && player.isAlive ? '#22c55e' : '#475569' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

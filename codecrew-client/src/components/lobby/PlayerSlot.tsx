import { motion } from 'framer-motion';
import { Avatar } from '@/components/ui/Avatar';
import { PlayerState } from '@/types/game';

interface Props {
  player: PlayerState | null;
  index: number;
}

export function PlayerSlot({ player, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 rounded-lg"
      style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}
    >
      {player ? (
        <>
          <Avatar src={player.avatarUrl} name={player.displayName} color={player.color} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{player.displayName}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {player.readyToStart ? '✓ Ready' : 'Waiting...'}
            </p>
          </div>
          {player.readyToStart && (
            <div className="w-2 h-2 rounded-full bg-green-400" />
          )}
        </>
      ) : (
        <>
          <div className="w-7 h-7 rounded-full border border-dashed" style={{ borderColor: 'var(--border)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Waiting for player...</p>
        </>
      )}
    </motion.div>
  );
}

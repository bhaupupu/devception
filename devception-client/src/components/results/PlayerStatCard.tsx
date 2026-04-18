import { motion } from 'framer-motion';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { PlayerState } from '@/types/game';

interface Props {
  player: PlayerState;
  isWinner: boolean;
  tasksCompleted: number;
  xpEarned: number;
  index: number;
}

export function PlayerStatCard({ player, isWinner, tasksCompleted, xpEarned, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="game-panel p-4 flex items-center gap-4"
    >
      <Avatar src={player.avatarUrl} name={player.displayName} color={player.color} size="md" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{player.displayName}</p>
        <div className="flex gap-2 mt-1">
          <Badge variant={player.role === 'imposter' ? 'red' : 'blue'}>
            {player.role === 'imposter' ? '😈 Imposter' : '👨‍💻 Coder'}
          </Badge>
          {isWinner && <Badge variant="green">Winner</Badge>}
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold" style={{ color: 'var(--accent-blue)' }}>+{xpEarned} XP</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{tasksCompleted} tasks</p>
      </div>
    </motion.div>
  );
}

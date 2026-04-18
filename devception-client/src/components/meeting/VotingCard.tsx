import { motion } from 'framer-motion';
import { Avatar } from '@/components/ui/Avatar';
import { PlayerState } from '@/types/game';

interface Props {
  player: PlayerState | null;
  isMe: boolean;
  hasVoted: boolean;
  myVote: string | null;
  onVote?: (targetId: string) => void;
  isSkip?: boolean;
}

export function VotingCard({ player, isMe, hasVoted, myVote, onVote, isSkip }: Props) {
  const targetId = isSkip ? 'skip' : player?.userId ?? '';
  const isVoted = myVote === targetId;
  const canVote = onVote && !myVote;

  return (
    <motion.button
      whileHover={canVote ? { scale: 1.03 } : {}}
      whileTap={canVote ? { scale: 0.97 } : {}}
      onClick={canVote ? () => onVote(targetId) : undefined}
      className="flex flex-col items-center p-4 rounded-xl transition-all"
      style={{
        background: isVoted ? 'rgba(239,68,68,0.2)' : 'var(--bg-hover)',
        border: `2px solid ${isVoted ? '#ef4444' : 'var(--border)'}`,
        cursor: canVote ? 'pointer' : 'default',
        opacity: myVote && !isVoted ? 0.6 : 1,
      }}
    >
      {isSkip ? (
        <>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg mb-2"
            style={{ background: 'var(--bg-card)' }}>
            🚫
          </div>
          <p className="text-xs font-medium">Skip Vote</p>
        </>
      ) : (
        <>
          <div className="relative mb-2">
            <Avatar src={player?.avatarUrl} name={player?.displayName ?? '?'} color={player?.color} size="md" />
            {hasVoted && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <p className="text-xs font-medium text-center truncate max-w-full">
            {player?.displayName}
            {isMe && <span style={{ color: 'var(--text-muted)' }}> (you)</span>}
          </p>
        </>
      )}
    </motion.button>
  );
}

import { motion } from 'framer-motion';
import { PlayerState } from '@/types/game';

interface Props {
  ejected: { userId: string; displayName: string; role: string; wasImposter: boolean } | null;
  tally: Record<string, number>;
  wasTie: boolean;
  players: PlayerState[];
}

export function VoteResults({ ejected, tally, wasTie, players }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      {ejected ? (
        <>
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-5xl mb-4"
          >
            {ejected.wasImposter ? '🎉' : '😔'}
          </motion.p>
          <h3 className="text-2xl font-black mb-1">
            <span style={{ color: ejected.wasImposter ? '#22c55e' : '#ef4444' }}>
              {ejected.displayName}
            </span>
            {' '}was ejected!
          </h3>
          <p className="text-lg font-semibold mb-4"
            style={{ color: ejected.wasImposter ? '#22c55e' : '#ef4444' }}>
            They {ejected.wasImposter ? 'WERE' : 'were NOT'} the imposter.
          </p>
        </>
      ) : (
        <>
          <p className="text-5xl mb-4">{wasTie ? '🤝' : '🚫'}</p>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
            {wasTie ? "It's a tie!" : 'No one was ejected.'} The game continues...
          </h3>
        </>
      )}

      {/* Tally */}
      {Object.keys(tally).length > 0 && (
        <div className="mt-4 space-y-2 max-w-xs mx-auto">
          {Object.entries(tally)
            .sort(([, a], [, b]) => b - a)
            .map(([targetId, votes]) => {
              const p = players.find((x) => x.userId === targetId);
              const name = targetId === 'skip' ? 'Skip' : (p?.displayName ?? 'Unknown');
              return (
                <div key={targetId} className="flex items-center gap-3">
                  <span className="text-sm flex-1 text-left" style={{ color: 'var(--text-secondary)' }}>
                    {name}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: votes }).map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-red-500/70" />
                    ))}
                  </div>
                  <span className="text-sm font-bold w-4">{votes}</span>
                </div>
              );
            })}
        </div>
      )}

      <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
        Resuming game in 5 seconds...
      </p>
    </motion.div>
  );
}

'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { WinnerBanner } from '@/components/results/WinnerBanner';
import { PlayerStatCard } from '@/components/results/PlayerStatCard';
import { Button } from '@/components/ui/Button';

interface Props {
  params: { roomId: string };
}

export default function ResultsPage({ params }: Props) {
  void params;
  const { data: session } = useSession();
  const router = useRouter();
  const { game, myRole, reset } = useGameStore();
  const _userId = (session?.user as { id?: string })?.id ?? '';

  if (!game || !game.winner) {
    return (
      <div className="pixel-bg min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-muted)' }}>Loading results...</p>
      </div>
    );
  }

  const handlePlayAgain = () => {
    reset();
    router.push('/lobby');
  };

  return (
    <main className="pixel-bg min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <WinnerBanner winner={game.winner} myRole={myRole} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3 mt-8"
        >
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Player Results
          </h2>
          {game.players.map((player, i) => {
            const isWinner =
              (game.winner === 'good-coders' && player.role === 'good-coder') ||
              (game.winner === 'imposters' && player.role === 'imposter');
            const xp = 50 + player.tasksCompleted.length * 15 + (isWinner ? 100 : 0);
            return (
              <PlayerStatCard
                key={player.userId}
                player={player}
                isWinner={isWinner}
                tasksCompleted={player.tasksCompleted.length}
                xpEarned={xp}
                index={i}
              />
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-3 mt-8"
        >
          <Button size="lg" className="flex-1" onClick={handlePlayAgain}>
            Play Again
          </Button>
          <Button size="lg" variant="secondary" onClick={() => router.push('/lobby')}>
            Lobby
          </Button>
        </motion.div>
      </div>
    </main>
  );
}

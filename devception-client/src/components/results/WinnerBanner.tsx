import { motion } from 'framer-motion';

interface Props {
  winner: 'good-coders' | 'imposters';
  myRole: string | null;
}

export function WinnerBanner({ winner, myRole }: Props) {
  const won =
    (winner === 'good-coders' && myRole === 'good-coder') ||
    (winner === 'imposters' && myRole === 'imposter');

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="text-center py-8"
    >
      <p className="text-7xl mb-4">{won ? '🏆' : '💀'}</p>
      <h1
        className="text-4xl font-black mb-2"
        style={{ color: won ? '#22c55e' : '#ef4444' }}
      >
        {won ? 'YOU WIN!' : 'YOU LOSE'}
      </h1>
      <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
        {winner === 'good-coders'
          ? 'The Good Coders completed the project!'
          : 'The Imposters successfully sabotaged the mission!'}
      </p>
    </motion.div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function RoleReveal({ onDone }: { onDone: () => void }) {
  const { myRole, myColor } = useGameStore();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const isImposter = myRole === 'imposter';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: isImposter ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.1)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: 3, duration: 0.5 }}
              className="text-8xl mb-6"
            >
              {isImposter ? '😈' : '👨‍💻'}
            </motion.div>
            <h1 className="text-4xl font-black mb-2" style={{ color: isImposter ? '#ef4444' : '#22c55e' }}>
              {isImposter ? 'You are the IMPOSTER' : 'You are a GOOD CODER'}
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              {isImposter
                ? 'Sabotage the team without getting caught!'
                : 'Work together to complete the code before time runs out!'}
            </p>
            <div className="mt-4 w-3 h-3 rounded-full mx-auto" style={{ background: myColor ?? '#fff' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

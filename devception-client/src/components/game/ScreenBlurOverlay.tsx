'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppSocket } from '@/lib/socket';
import { useGameStore } from '@/store/gameStore';

interface Props {
  socket: AppSocket | null;
  myRole: string | null;
}

export function ScreenBlurOverlay({ socket, myRole }: Props) {
  const [blurred, setBlurred] = useState(false);
  const { isLocked } = useGameStore();

  useEffect(() => {
    if (!socket) return;

    socket.on('imposter:screen-blurred', ({ durationMs }: { durationMs: number }) => {
      // Imposters are immune to blur (server already doesn't send to them, but double-check)
      if (myRole === 'imposter') return;
      setBlurred(true);
      setTimeout(() => setBlurred(false), durationMs);
    });

    return () => { socket.off('imposter:screen-blurred'); };
  }, [socket, myRole]);

  return (
    <>
      {/* Screen blur overlay */}
      <AnimatePresence>
        {blurred && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
            style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.3)' }}
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-center"
            >
              <p className="text-4xl mb-2">😵</p>
              <p className="font-bold text-lg" style={{ color: '#ef4444' }}>Screen Disrupted!</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>The imposter targeted you</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard lock overlay */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 pointer-events-none flex items-end justify-center pb-24"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="px-6 py-3 rounded-xl text-center"
              style={{ background: 'rgba(239,68,68,0.9)', color: '#fff' }}
            >
              <p className="text-sm font-bold">🔒 Keyboard Locked for 15s!</p>
              <p className="text-xs opacity-80">The imposter locked your keyboard</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

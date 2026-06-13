'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface CinematicContextValue {
  isEntering: boolean;
  triggerCinematic: (url?: string) => void;
}

const CinematicContext = createContext<CinematicContextValue | null>(null);

export function useCinematic() {
  const ctx = useContext(CinematicContext);
  if (!ctx) throw new Error('useCinematic must be used within CinematicProvider');
  return ctx;
}

const GRID_ROWS = 8;
const GRID_COLS = 8;
const BLOCKS = Array.from({ length: GRID_ROWS * GRID_COLS }, (_, i) => ({
  r: Math.floor(i / GRID_COLS),
  c: i % GRID_COLS,
}));

export function CinematicProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'idle' | 'entering' | 'exiting'>('idle');
  const router = useRouter();

  const triggerCinematic = (url = '/login') => {
    if (phase !== 'idle') return;
    setPhase('entering');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Wait for entering sweep to fully cover screen (0.56s max delay + 0.25s animation)
    setTimeout(() => {
      router.push(url);
      
      // Let the route loading initiate
      setTimeout(() => {
        setPhase('exiting');
        
        // Wait for exit sweep to complete (0.42s max delay + 0.25s animation)
        setTimeout(() => {
          setPhase('idle');
        }, 750);
      }, 200);
    }, 850);
  };

  return (
    <CinematicContext.Provider value={{ isEntering: phase === 'entering', triggerCinematic }}>
      <div style={{ position: 'relative' }}>
        {/* Main Content wrapper */}
        <div 
          style={{
            transform: phase === 'entering' ? 'scale(1.02)' : 'scale(1)',
            filter: phase === 'entering' ? 'blur(8px)' : 'blur(0px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {children}
        </div>

        {/* Cinematic pixel sweep overlay */}
        {phase !== 'idle' && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              pointerEvents: 'auto', // block double clicks
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
              background: 'transparent',
            }}
          >
            {BLOCKS.map((block, i) => {
              const isEven = (block.r + block.c) % 2 === 0;
              const bg = isEven ? '#faf8f4' : '#f0ece2'; // checkerboard cream tones
              
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={phase === 'entering' ? { scale: 1.05 } : { scale: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: phase === 'entering'
                      ? (block.r + block.c) * 0.04
                      : (14 - block.r - block.c) * 0.03,
                    ease: 'easeInOut',
                  }}
                  style={{
                    background: bg,
                    border: '1px solid rgba(28,25,23,0.12)', // subtle grid line
                    transformOrigin: 'center',
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </CinematicContext.Provider>
  );
}

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

export function CinematicProvider({ children }: { children: React.ReactNode }) {
  const [isEntering, setIsEntering] = useState(false);
  const router = useRouter();

  const triggerCinematic = (url = '/login') => {
    if (isEntering) return;
    setIsEntering(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      router.push(url);
      setTimeout(() => {
        setIsEntering(false);
      }, 1000);
    }, 1500);
  };

  return (
    <CinematicContext.Provider value={{ isEntering, triggerCinematic }}>
      <div style={{ position: 'relative' }}>
        {/* Main Content wrapper */}
        <div 
          style={{
            transform: isEntering ? 'scale(1.03)' : 'scale(1)',
            filter: isEntering ? 'blur(12px)' : 'blur(0px)',
            transition: 'all 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {children}
        </div>

        {/* Cinematic Overlay */}
        {isEntering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: '#0a0d12',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Space Mono', monospace",
              color: '#16a34a',
            }}
          >
            {/* Retro Loading Console */}
            <div
              style={{
                width: 340,
                padding: '24px',
                border: '3px solid #16a34a',
                background: '#0d1117',
                boxShadow: '0 0 30px rgba(22, 163, 74, 0.2)',
                position: 'relative',
              }}
            >
              {/* Header */}
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  marginBottom: 18,
                  borderBottom: '2px solid #16a34a',
                  paddingBottom: 10,
                  color: '#16a34a',
                  letterSpacing: '0.15em',
                }}
              >
                // ESTABLISHING CONNECTION
              </div>

              {/* Console Output logs */}
              <div
                style={{
                  fontSize: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  minHeight: 68,
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                <div style={{ animation: 'fadeInText 0.1s forwards' }}>
                  &gt; CONNECTING TO THE MATRIX...
                </div>
                <div
                  style={{
                    opacity: 0,
                    animation: 'fadeInText 0.1s forwards',
                    animationDelay: '0.4s',
                  }}
                >
                  &gt; SYNCING SECURE PROTOCOLS...
                </div>
                <div
                  style={{
                    opacity: 0,
                    animation: 'fadeInText 0.1s forwards',
                    animationDelay: '0.8s',
                  }}
                >
                  &gt; SECURITY HANDSHAKE COMPLETED.
                </div>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  marginTop: 20,
                  border: '2px solid #16a34a',
                  height: 14,
                  position: 'relative',
                  background: 'rgba(22, 163, 74, 0.05)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.3, ease: 'easeInOut' }}
                  style={{
                    height: '100%',
                    background: '#16a34a',
                  }}
                />
              </div>
            </div>

            <style>{`
              @keyframes fadeInText {
                to { opacity: 1; }
              }
            `}</style>
          </motion.div>
        )}
      </div>
    </CinematicContext.Provider>
  );
}

'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

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

const OVERLAY_CLOUDS = [
  { id: 1, x: 5,  y: 8,  size: 80,  depth: 1 },
  { id: 2, x: 22, y: 4,  size: 120, depth: 2 },
  { id: 3, x: 55, y: 6,  size: 100, depth: 1 },
  { id: 4, x: 75, y: 3,  size: 60,  depth: 2 },
  { id: 5, x: 88, y: 10, size: 140, depth: 1 },
  { id: 6, x: 40, y: 12, size: 90,  depth: 2 },
  { id: 7, x: 12, y: 18, size: 75,  depth: 1 },
  { id: 8, x: 65, y: 15, size: 110, depth: 2 },
];

export function CinematicProvider({ children }: { children: React.ReactNode }) {
  const [isEntering, setIsEntering] = useState(false);
  const [cloudOffset, setCloudOffset] = useState(0);
  const router = useRouter();
  const rafRef = useRef<number | null>(null);

  const triggerCinematic = (url = '/login') => {
    if (isEntering) return;
    setIsEntering(true);
    
    // Auto scroll to top to see the transition better if we're not fixed fullscreen
    // But since our overlay is fixed fullscreen, we don't strictly need to scroll, 
    // but it helps if the background blurs out nicely.
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let start = performance.now();
    const duration = 1500;
    
    const animateWarp = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeInExpo = progress === 0 ? 0 : Math.pow(2, 10 * progress - 10);
      
      setCloudOffset(easeInExpo * 15000);
      
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateWarp);
      } else {
        router.push(url);
        // Reset after navigation
        setTimeout(() => {
          setIsEntering(false);
          setCloudOffset(0);
        }, 1000);
      }
    };
    
    rafRef.current = requestAnimationFrame(animateWarp);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <CinematicContext.Provider value={{ isEntering, triggerCinematic }}>
      <div style={{ position: 'relative' }}>
        {/* Main Content wrapper */}
        <div 
          style={{
            transform: isEntering ? 'scale(1.05)' : 'scale(1)',
            filter: isEntering ? 'blur(10px)' : 'blur(0px)',
            transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {children}
        </div>

        {/* Cinematic Overlay */}
        {isEntering && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              pointerEvents: 'none',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Warp Clouds */}
            {OVERLAY_CLOUDS.map((cloud) => {
              const tx = cloudOffset * cloud.depth * 0.03;
              const h = Math.round(cloud.size * 0.5);
              return (
                <div
                  key={cloud.id}
                  style={{
                    position: 'absolute',
                    left: cloud.x + '%',
                    top: cloud.y + '%',
                    transform: `translateX(${tx}px)`,
                    willChange: 'transform',
                  }}
                >
                  <div style={{ position: 'relative', width: cloud.size, height: h }}>
                    <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '55%', background: '#fff', border: '2px solid #1c1917' }} />
                    <div style={{ position: 'absolute', bottom: '45%', left: '20%', width: '60%', height: '55%', background: '#fff', border: '2px solid #1c1917' }} />
                    <div style={{ position: 'absolute', bottom: '55%', left: '35%', width: '40%', height: '50%', background: '#fff', border: '2px solid #1c1917' }} />
                  </div>
                </div>
              );
            })}

            {/* Central Terminal Message */}
            <div
              style={{
                background: '#0d1117',
                border: '3px solid #16a34a',
                padding: '20px 40px',
                boxShadow: '0 0 40px rgba(22, 163, 74, 0.4)',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 16,
                color: '#16a34a',
                textAlign: 'center',
              }}
            >
              <span style={{ animation: 'pulse-blink 1s step-end infinite' }}>
                UPLINK ESTABLISHED
              </span>
            </div>
            <style>{`@keyframes pulse-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
          </div>
        )}
      </div>
    </CinematicContext.Provider>
  );
}

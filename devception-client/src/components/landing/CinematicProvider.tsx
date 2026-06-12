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
  const [cloudOffset, setCloudOffset] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const rafRef = useRef<number | null>(null);

  const triggerCinematic = (url = '/login') => {
    if (isEntering) return;
    setIsEntering(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let start = performance.now();
    const duration = 1500;
    
    const animateWarp = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeInExpo = progress === 0 ? 0 : Math.pow(2, 10 * progress - 10);
      
      setCloudOffset({
        x: easeInExpo * 10000,
        y: easeInExpo * 2000
      });
      
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateWarp);
      } else {
        router.push(url);
        setTimeout(() => {
          setIsEntering(false);
          setCloudOffset({ x: 0, y: 0 });
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
            opacity: isEntering ? 0 : 1,
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
              background: 'linear-gradient(to bottom, #ebdccc 0%, #d1c1ad 100%)',
              backgroundImage: 'url(/hero-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              animation: 'cinematic-fade-in 0.4s ease-out forwards',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Blueprint grid overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(28,25,23,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(28,25,23,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                zIndex: 0,
              }}
            />

            {/* Warp Clouds */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
              {OVERLAY_CLOUDS.map((cloud) => {
                const tx = cloudOffset.x * cloud.depth * 0.03;
                const ty = cloudOffset.y * cloud.depth * 0.015;
                const h = Math.round(cloud.size * 0.5);
                const bg = 'rgba(255, 255, 255, 0.45)';
                return (
                  <div
                    key={cloud.id}
                    style={{
                      position: 'absolute',
                      left: cloud.x + '%',
                      top: cloud.y + '%',
                      transform: `translateX(${tx}px) translateY(${ty}px)`,
                      transition: 'transform 0.1s linear',
                      willChange: 'transform',
                    }}
                  >
                    <div style={{ position: 'relative', width: cloud.size, height: h }}>
                      <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '55%', background: bg }} />
                      <div style={{ position: 'absolute', bottom: '45%', left: '20%', width: '60%', height: '55%', background: bg }} />
                      <div style={{ position: 'absolute', bottom: '55%', left: '35%', width: '40%', height: '50%', background: bg }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <style>{`
              @keyframes cinematic-fade-in { from { opacity: 0 } to { opacity: 1 } }
            `}</style>
          </div>
        )}
      </div>
    </CinematicContext.Provider>
  );
}

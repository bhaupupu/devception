'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCinematic } from './CinematicProvider';

export default function FinalCTASection() {
  const [glitch, setGlitch] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const { triggerCinematic } = useCinematic();

  useEffect(() => {
    // Glitch effect on heading
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 3400);

    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <section
      id="cta"
      className="final-cta-section"
      style={{ padding: '120px 0', position: 'relative', overflow: 'hidden' }}
    >
      {/* Pixel decorative corners */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          width: 32,
          height: 32,
          borderTop: '4px solid #2563eb',
          borderLeft: '4px solid #2563eb',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 32,
          height: 32,
          borderTop: '4px solid #2563eb',
          borderRight: '4px solid #2563eb',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          width: 32,
          height: 32,
          borderBottom: '4px solid #2563eb',
          borderLeft: '4px solid #2563eb',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 32,
          height: 32,
          borderBottom: '4px solid #2563eb',
          borderRight: '4px solid #2563eb',
          pointerEvents: 'none',
        }}
      />

      {/* Pixel dots decorations */}
      {[
        { top: '15%', left: '8%' },
        { top: '60%', left: '5%' },
        { top: '30%', right: '7%' },
        { top: '75%', right: '10%' },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            background: '#2563eb',
            opacity: 0.4,
            pointerEvents: 'none',
            ...pos,
          }}
        />
      ))}

      <motion.div
        className="section-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
      >
        {/* Status badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            border: '2px solid #2563eb',
            padding: '6px 18px',
            marginBottom: 40,
            background: 'rgba(37,99,235,0.06)',
            boxShadow: '3px 3px 0 #2563eb',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              background: '#16a34a',
              display: 'inline-block',
              flexShrink: 0,
              animation: 'blink-cursor 1.2s step-end infinite',
            }}
          />
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: '#2563eb',
              letterSpacing: '0.15em',
            }}
          >
            LOBBY OPEN
          </span>
        </div>

        {/* Main heading */}
        <h2
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(22px, 4.5vw, 52px)',
            color: '#1c1917',
            lineHeight: 1.5,
            marginBottom: 24,
            textShadow: glitch ? '2px 0 #dc2626, -2px 0 #2563eb' : 'none',
            transition: 'text-shadow 0.05s',
          }}
        >
          READY TO{' '}
          <span style={{ color: '#2563eb' }}>PLAY?</span>
        </h2>

        {/* Subtext card */}
        <div
          style={{
            border: '3px solid #1c1917',
            borderLeft: '6px solid #2563eb',
            padding: '18px 28px',
            display: 'inline-block',
            marginBottom: 52,
            background: '#faf8f4',
            boxShadow: '4px 4px 0 #1c1917',
            textAlign: 'left',
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              color: '#44403c',
              lineHeight: 1.9,
              margin: 0,
            }}
          >
            Join a room.{' '}
            <strong style={{ color: '#1c1917' }}>Get your role.</strong>{' '}
            <strong style={{ color: '#dc2626' }}>Trust no one.</strong>
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 64,
          }}
        >
          <button
            onClick={() => triggerCinematic('/play')}
            className="pixel-btn pixel-btn-blue"
            style={{ fontSize: 10, textDecoration: 'none', padding: '20px 44px' }}
          >
            ▶ PLAY NOW
          </button>
          <a
            href="#how-it-works"
            className="landing-btn-secondary"
            style={{ fontSize: 11, padding: '20px 44px' }}
          >
            HOW IT WORKS
          </a>
        </div>

        {/* Terminal teaser block */}
        <div
          style={{
            border: '3px solid #1c1917',
            padding: '20px 32px',
            display: 'inline-block',
            background: '#1c1917',
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            lineHeight: 2.1,
            textAlign: 'left',
            boxShadow: '4px 4px 0 #44403c',
          }}
        >
          <div style={{ color: '#2563eb' }}>&gt; devception --join-match --trust=false</div>
          <div style={{ color: '#16a34a' }}>Connecting to nearest game room...</div>
          <div style={{ color: '#ca8a04' }}>WARNING: Imposter detected in lobby.</div>
          <div style={{ color: '#e5e0d5' }}>
            Good luck, agent.
            <span
              style={{
                display: 'inline-block',
                width: 9,
                height: 15,
                background: '#e5e0d5',
                verticalAlign: 'middle',
                marginLeft: 4,
                opacity: cursorVisible ? 1 : 0,
                transition: 'opacity 0.05s',
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

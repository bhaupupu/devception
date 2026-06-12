'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCinematic } from './CinematicProvider';

/* ── Soft Pixel Clouds ── */
function SoftPixelCloud({ size = 120 }: { size?: number }) {
  const h = Math.round(size * 0.5);
  const bg = 'rgba(255, 255, 255, 0.45)'; // Soft, low-contrast, no borders

  return (
    <div style={{ position: 'relative', width: size, height: h }}>
      <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '80%', height: '55%', background: bg }} />
      <div style={{ position: 'absolute', bottom: '45%', left: '20%', width: '60%', height: '55%', background: bg }} />
      <div style={{ position: 'absolute', bottom: '55%', left: '35%', width: '40%', height: '50%', background: bg }} />
    </div>
  );
}

function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    // 4 clouds of varying sizes and speeds for parallax
    const clouds = [
      { id: 0, x: 10, y: 15, size: 80, speed: 0.15, ox: 0, oy: 0 },
      { id: 1, x: 60, y: 35, size: 140, speed: 0.25, ox: 0, oy: 0 },
      { id: 2, x: 30, y: 65, size: 100, speed: 0.2, ox: 0, oy: 0 },
      { id: 3, x: 80, y: 80, size: 180, speed: 0.35, ox: 0, oy: 0 },
    ].map(c => ({
      ...c,
      x: (c.x / 100) * window.innerWidth
    }));

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      clouds.forEach((cloud, i) => {
        // Continuous horizontal scroll
        cloud.x += cloud.speed;
        if (cloud.x > window.innerWidth + cloud.size) {
          cloud.x = -cloud.size;
          cloud.y = Math.random() * 80 + 10;
        }

        const el = cloudRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          
          const dx = cx - mouseX;
          const dy = cy - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const interactionRadius = 250;

          // Repulsion effect
          if (dist < interactionRadius && dist > 0) {
            const force = (interactionRadius - dist) / interactionRadius;
            cloud.ox += (dx / dist) * force * 1.5;
            cloud.oy += (dy / dist) * force * 1.5;
          } else {
            // Spring back to base offset
            cloud.ox += (0 - cloud.ox) * 0.05;
            cloud.oy += (0 - cloud.oy) * 0.05;
          }

          el.style.transform = `translate3d(${cloud.x + cloud.ox}px, calc(${cloud.y}vh + ${cloud.oy}px), 0)`;
        }
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          ref={el => { cloudRefs.current[i] = el; }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            willChange: 'transform'
          }}
        >
          <SoftPixelCloud size={[80, 140, 100, 180][i]} />
        </div>
      ))}
    </div>
  );
}

/* ── Terminal animation ── */
const TERMINAL_SEQUENCE = [
  { text: '> initializing secure room...', color: '#555', delay: 0 },
  { text: 'SUCCESS — room ID: DCPTN-7734', color: '#16a34a', delay: 900 },
  { text: '> assigning roles...', color: '#555', delay: 1600 },
  { text: 'SUCCESS — 1 IMPOSTER assigned', color: '#16a34a', delay: 2400 },
  { text: '> scanning for anomalies...', color: '#555', delay: 3200 },
  { text: 'WARNING — trust level: 14%', color: '#ca8a04', delay: 4200 },
  { text: '> analyzing commit history...', color: '#555', delay: 5000 },
  { text: 'ALERT — suspicious code in player_3', color: '#dc2626', delay: 5900 },
  { text: '> good luck, agent.', color: '#2563eb', delay: 6700 },
];

function TerminalPanel() {
  const [lines, setLines] = useState<typeof TERMINAL_SEQUENCE>([]);
  const [cursor, setCursor] = useState(true);
  const [restartCount, setRestartCount] = useState(0);

  useEffect(() => {
    setLines([]);
    const timers: ReturnType<typeof setTimeout>[] = [];
    TERMINAL_SEQUENCE.forEach((item) => {
      timers.push(setTimeout(() => {
        setLines((prev) => [...prev, item]);
      }, item.delay));
    });
    const cursorInterval = setInterval(() => setCursor((c) => !c), 530);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(cursorInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restartCount]);

  useEffect(() => {
    if (lines.length === TERMINAL_SEQUENCE.length) {
      const t = setTimeout(() => {
        setLines([]);
        setRestartCount((c) => c + 1);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [lines.length]);

  return (
    <div
      style={{
        background: '#0d1117',
        border: '3px solid #1c1917',
        boxShadow: '4px 4px 0 #1c1917',
        padding: '20px',
        fontFamily: "'Space Mono', monospace",
        fontSize: 11,
        lineHeight: 2,
        minHeight: 200,
        position: 'relative',
      }}
    >
      <div
        style={{
          background: '#16a34a',
          color: '#fff',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 7,
          padding: '3px 10px',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          letterSpacing: '0.1em',
        }}
      >
        TERMINAL — DEVCEPTION SECURE SHELL v2.1 &nbsp;&nbsp;&nbsp; [ENCRYPTED]
      </div>
      <div style={{ marginTop: 28 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: line.color }}>
            {line.text}
          </div>
        ))}
        {cursor && (
          <span
            style={{
              display: 'inline-block',
              width: 9,
              height: 14,
              background: '#16a34a',
              marginLeft: 4,
              verticalAlign: 'middle',
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ── VS Code Panel ── */
function VSCodePanel() {
  const code = `// devception-match.ts
// MISSION ACTIVE — DO NOT DISTRIBUTE

const players: Player[] = loadSession();
const imposters: number = Math.ceil(players.length / 6);
const trust: boolean = false; // never

interface Player {
  id: string;
  role: 'developer' | 'imposter';
  trustScore: number;
}

function startMatch(room: Room): MatchResult {
  assignRoles(players, imposters);
  broadcastChallenge(room.challenge);
  
  return runGameLoop({
    onCodeChange: syncToAll,
    onSabotage:   detectAndFlag,
    onVote:       eliminatePlayer,
    onComplete:   declareWinner,
  });
}

// find the imposter
startMatch(currentRoom);`;

  const highlight = (line: string) => {
    if (line.trim().startsWith('//')) return <span style={{ color: '#6a9955' }}>{line}</span>;
    return line.split(/(\bconst\b|\blet\b|\bvar\b|\bfunction\b|\breturn\b|\binterface\b|\bstring\b|\bnumber\b|\btrue\b|\bfalse\b)/g).map((token, i) => {
      if (['const', 'let', 'var', 'function', 'return', 'interface'].includes(token))
        return <span key={i} style={{ color: '#569cd6' }}>{token}</span>;
      if (['true', 'false'].includes(token))
        return <span key={i} style={{ color: '#b5cea8' }}>{token}</span>;
      if (token === 'string' || token === 'number')
        return <span key={i} style={{ color: '#4ec9b0' }}>{token}</span>;
      return <span key={i}>{token}</span>;
    });
  };

  return (
    <div
      style={{
        background: '#1e1e1e',
        border: '3px solid #1c1917',
        boxShadow: '4px 4px 0 #1c1917',
        fontFamily: "'Space Mono', monospace",
        fontSize: 10,
        lineHeight: 1.8,
        overflow: 'hidden',
      }}
    >
      {/* Titlebar */}
      <div style={{
        background: '#2d2d2d',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderBottom: '1px solid #444',
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c940' }} />
        <span style={{ color: '#888', fontSize: 9, marginLeft: 8, fontFamily: "'Press Start 2P', monospace" }}>
          devception-match.ts
        </span>
        <span style={{ marginLeft: 'auto', color: '#dc2626', fontSize: 8, fontFamily: "'Press Start 2P', monospace" }}>
          ● LIVE
        </span>
      </div>
      {/* Code body */}
      <div style={{ display: 'flex', maxHeight: 240, overflowY: 'auto' }}>
        {/* Line numbers */}
        <div style={{
          padding: '12px 10px',
          color: '#555',
          userSelect: 'none',
          textAlign: 'right',
          minWidth: 32,
          borderRight: '1px solid #333',
          fontSize: 9,
          flexShrink: 0,
        }}>
          {code.split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        {/* Code */}
        <div style={{ padding: '12px 14px', overflow: 'auto', color: '#d4d4d4', flexGrow: 1 }}>
          {code.split('\n').map((line, i) => (
            <div key={i}>{highlight(line) || '\u00a0'}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Mission Brief Card ── */
function MissionBriefCard() {
  const items = [
    { icon: '👥', label: '4–8 PLAYERS', color: '#2563eb' },
    { icon: '⏱', label: '15 MIN MATCH', color: '#16a34a' },
    { icon: '💻', label: 'REAL CODE', color: '#ca8a04' },
    { icon: '🔍', label: 'TRUST NO ONE', color: '#dc2626' },
  ];

  return (
    <div
      style={{
        background: '#faf8f4',
        border: '3px solid #1c1917',
        boxShadow: '4px 4px 0 #1c1917',
        padding: 20,
      }}
    >
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8,
        color: '#1c1917',
        marginBottom: 16,
        letterSpacing: '0.12em',
        borderBottom: '2px solid #1c1917',
        paddingBottom: 10,
      }}>
        ▌ MISSION BRIEF
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              background: '#f0ece2',
              border: `2px solid ${item.color}`,
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: item.color,
              lineHeight: 1.6,
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── HERO SECTION ── */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isEntering, triggerCinematic } = useCinematic();

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        paddingTop: 100,
        paddingBottom: 100,
        display: 'flex',
        alignItems: 'center',
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Cloud layer */}
      <AnimatedBackground />

      {/* Content */}
      <div className="section-container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        {/* Mission status badge */}
        <div style={{ marginBottom: 32 }}>
          <span
            className="pixel-tag"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#faf8f4', border: '2px solid #1c1917', padding: '6px 12px', fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: '#1c1917' }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                background: '#dc2626',
                display: 'inline-block',
                flexShrink: 0,
                animation: 'pulse-blink 1s step-end infinite',
              }}
            />
            <style>{`@keyframes pulse-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
            MISSION STATUS: ACTIVE
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 60,
            alignItems: 'start',
          }}
        >
          {/* LEFT COLUMN */}
          <div>
            <h1
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'clamp(18px, 3vw, 38px)',
                lineHeight: 1.6,
                color: '#1c1917',
                marginBottom: 24,
              }}
            >
              ONE OF YOUR
              <br />
              <span style={{ color: '#2563eb' }}>TEAMMATES</span>
              <br />
              IS LYING.
            </h1>

            <div
              style={{
                background: '#faf8f4',
                border: '2px solid #2563eb',
                borderLeft: '4px solid #2563eb',
                padding: '12px 16px',
                marginBottom: 24,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#44403c',
                lineHeight: 1.9,
              }}
            >
              A rogue developer has infiltrated your team.
              <br />
              <strong style={{ color: '#1c1917' }}>Your objective:</strong>
              <br />
              Write code. Complete objectives. Expose the imposter.
            </div>

            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                color: '#44403c',
                lineHeight: 1.9,
                marginBottom: 36,
                maxWidth: 500,
              }}
            >
              Devception is a{' '}
              <strong style={{ color: '#1c1917' }}>multiplayer social deduction coding game</strong>{' '}
              where players collaborate on real coding challenges while secretly hunting an imposter
              hidden among the team.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button onClick={() => triggerCinematic('/login')} className="pixel-btn pixel-btn-blue" style={{ textDecoration: 'none' }}>
                ▶ PLAY NOW
              </button>
              <a href="#how-it-works" className="pixel-btn pixel-btn-light">
                ◎ HOW IT WORKS
              </a>
            </div>

            {/* Mission Brief */}
            <div style={{ marginTop: 36 }}>
              <MissionBriefCard />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <TerminalPanel />
            <VSCodePanel />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #hero .section-container > div > div:last-child {
            display: none;
          }
          #hero .section-container > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

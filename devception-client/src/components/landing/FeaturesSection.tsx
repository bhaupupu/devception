'use client';
import React from 'react';

const MODULES = [
  {
    id: '01',
    title: 'REAL-TIME MULTIPLAYER',
    icon: '⚡',
    status: 'ACTIVE',
    color: '#2563eb',
    desc: 'Powered by Socket.IO, Devception delivers sub-100ms synchronization across all connected players. Every keystroke, cursor position, and code change propagates instantly to all participants. No refreshes. No polling. Pure WebSocket performance optimized for low-latency gaming.',
  },
  {
    id: '02',
    title: 'SOCIAL DEDUCTION',
    icon: '🕵️',
    status: 'ACTIVE',
    color: '#dc2626',
    desc: 'One hidden imposter. Unlimited suspicion. The social deduction engine tracks player behavior, flags anomalies in code patterns, and enables emergency voting. Every match is a psychological thriller — who can you trust when the evidence is in the code itself?',
  },
  {
    id: '03',
    title: 'LIVE CODING',
    icon: '💻',
    status: 'ACTIVE',
    color: '#16a34a',
    desc: 'A fully synchronized code editor at the heart of every match. All players share the same live codebase. Multi-module programming challenges require genuine collaboration across functions, files, and logical components. This is not pseudocode — this is real code, running in real time.',
  },
  {
    id: '04',
    title: 'PRIVATE ROOMS',
    icon: '🔒',
    status: 'ACTIVE',
    color: '#7c3aed',
    desc: 'Create encrypted private rooms with unique 6-character codes. Share with friends, colleagues, or your Discord community. Configure player limits, difficulty settings, and language preferences. Each room is an independent secure session — your matches, your rules.',
  },
  {
    id: '05',
    title: 'RANKINGS',
    icon: '🏆',
    status: 'ACTIVE',
    color: '#ca8a04',
    desc: 'A competitive ranking system that tracks your performance across all matches. ELO-style scoring rewards wins, successful impostor identifications, task completions, and tactical voting accuracy. Climb the global leaderboard and earn rank titles from "Junior Dev" to "Legendary Architect".',
  },
  {
    id: '06',
    title: 'MATCH HISTORY',
    icon: '📊',
    status: 'ACTIVE',
    color: '#2563eb',
    desc: 'Every match is logged and archived in your player profile. Review your coding contributions, vote history, sabotage attempts, and win/loss record. Detailed analytics highlight your play style trends — are you a suspicious imposter or a vigilant detective developer?',
  },
  {
    id: '07',
    title: 'RETRO INTERFACE',
    icon: '🎮',
    status: 'ACTIVE',
    color: '#16a34a',
    desc: 'Devception\'s UI is a love letter to retro computing, hacker terminals, and classic multiplayer games. Pixel fonts, blueprint-grid backgrounds, sharp borders, scanline overlays, and monospace everywhere. This interface doesn\'t just display the game — it makes you feel like you\'re inside a classified operation.',
  },
  {
    id: '08',
    title: 'COMMUNITY EVENTS',
    icon: '🌐',
    status: 'BETA',
    color: '#ca8a04',
    desc: 'Scheduled community tournaments, themed challenge weeks, and developer scrimmages. Compete in organized events with special leaderboards, exclusive cosmetics, and recognition in the Devception Hall of Fame. Events are announced via Discord and the in-game notification system.',
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: '100px 0',
        borderTop: '1px solid rgba(37,99,235,0.2)',
      }}
    >
      <div className="section-container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label">// MODULE REGISTRY</div>
          <h2 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(14px, 2vw, 24px)',
            color: '#fff',
            lineHeight: 1.6,
          }}>
            SYSTEM FEATURES
          </h2>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            color: '#666',
            marginTop: 12,
          }}>
            8 active modules · All systems operational
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {MODULES.map((mod) => (
            <div
              key={mod.id}
              className="module-card"
              data-module={`MODULE ${mod.id}`}
              style={{ position: 'relative' }}
            >
              {/* Status badge */}
              <div style={{
                position: 'absolute',
                top: 10,
                right: 12,
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 6,
                color: mod.status === 'ACTIVE' ? '#16a34a' : '#ca8a04',
                border: `1px solid ${mod.status === 'ACTIVE' ? '#16a34a' : '#ca8a04'}`,
                padding: '3px 7px',
              }}>
                {mod.status}
              </div>

              <div style={{ fontSize: 24, marginBottom: 12 }}>{mod.icon}</div>

              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 7,
                color: '#666',
                marginBottom: 8,
                letterSpacing: '0.15em',
              }}>
                MODULE {mod.id}
              </div>

              <h3 style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                color: mod.color,
                lineHeight: 1.7,
                marginBottom: 16,
              }}>
                {mod.title}
              </h3>

              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#a0a0a0',
                lineHeight: 1.8,
              }}>
                {mod.desc}
              </p>

              {/* Bottom accent line */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                background: mod.color,
                opacity: 0.4,
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

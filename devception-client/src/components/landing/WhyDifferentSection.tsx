'use client';
import React from 'react';

const COMPARISONS = [
  { feature: 'Game Mode', traditional: 'Solo', devception: 'Multiplayer (4-8 players)', dev_good: true },
  { feature: 'Engagement', traditional: 'Repetitive grind', devception: 'Dynamic, story-driven matches', dev_good: true },
  { feature: 'Social Interaction', traditional: 'None — isolated sessions', devception: 'Real-time chat, voting, coordination', dev_good: true },
  { feature: 'Strategy Required', traditional: 'Pure technical knowledge', devception: 'Technical + psychological + strategic', dev_good: true },
  { feature: 'Replay Value', traditional: 'Low — same problem, same format', devception: 'High — different roles, teams, outcomes every match', dev_good: true },
  { feature: 'Communication', traditional: 'Not applicable', devception: 'Core mechanic — debate, accuse, defend', dev_good: true },
  { feature: 'Team Dynamics', traditional: 'None', devception: 'Trust, betrayal, collaboration, deception', dev_good: true },
  { feature: 'Tension & Excitement', traditional: 'Minimal', devception: 'Maximum — every match has a hidden threat', dev_good: true },
  { feature: 'Learning Outcome', traditional: 'Algorithmic patterns', devception: 'Algorithms + communication + critical thinking', dev_good: true },
  { feature: 'Session Length', traditional: 'Indefinite grinding', devception: 'Focused 15-20 minute matches', dev_good: true },
];

export default function WhyDifferentSection() {
  return (
    <section
      id="why"
      style={{
        padding: '100px 0',
        borderTop: '1px solid rgba(37,99,235,0.2)',
        background: 'rgba(37,99,235,0.02)',
      }}
    >
      <div className="section-container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label">// COMPETITIVE ANALYSIS</div>
          <h2 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(14px, 2vw, 24px)',
            color: '#fff',
            lineHeight: 1.6,
          }}>
            WHY DEVCEPTION IS DIFFERENT
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          {/* Left: comparison table */}
          <div>
            <div style={{
              border: '2px solid rgba(37,99,235,0.3)',
              overflow: 'hidden',
            }}>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                background: '#0d1117',
                borderBottom: '2px solid rgba(37,99,235,0.3)',
              }}>
                {['FEATURE', 'TRADITIONAL', 'DEVCEPTION'].map((h, i) => (
                  <div key={h} style={{
                    padding: '12px 16px',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    color: i === 2 ? '#2563eb' : '#666',
                    borderRight: i < 2 ? '1px solid rgba(37,99,235,0.2)' : 'none',
                    letterSpacing: '0.08em',
                  }}>
                    {h}
                  </div>
                ))}
              </div>

              {COMPARISONS.map((row, i) => (
                <div
                  key={row.feature}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    borderBottom: i < COMPARISONS.length - 1 ? '1px solid rgba(37,99,235,0.1)' : 'none',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(37,99,235,0.02)',
                  }}
                >
                  <div style={{
                    padding: '12px 16px',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    color: '#666',
                    borderRight: '1px solid rgba(37,99,235,0.1)',
                  }}>
                    {row.feature}
                  </div>
                  <div style={{
                    padding: '12px 16px',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    color: '#555',
                    borderRight: '1px solid rgba(37,99,235,0.1)',
                  }}>
                    <span style={{ color: '#dc2626', marginRight: 6 }}>✗</span>
                    {row.traditional}
                  </div>
                  <div style={{
                    padding: '12px 16px',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    color: '#a0a0a0',
                  }}>
                    <span style={{ color: '#16a34a', marginRight: 6 }}>✓</span>
                    {row.devception}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: long-form copy */}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#a0a0a0', lineHeight: 1.9 }}>
            <h3 style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: '#2563eb',
              marginBottom: 20,
              lineHeight: 2,
            }}>
              THE ARGUMENT FOR SOCIAL CODING
            </h3>
            <p style={{ marginBottom: 20 }}>
              The coding education industry has spent the past decade optimizing for the wrong thing: individual performance on isolated problems. Platforms that give you a problem, a compiler, and a submit button are teaching you to code in a vacuum — and most professional development doesn&apos;t happen in a vacuum.
            </p>
            <p style={{ marginBottom: 20 }}>
              Real software is built in teams. Real bugs are found in code review. Real architecture decisions happen in discussions, debates, and sometimes heated disagreements. Yet the dominant model for developer practice remains fundamentally antisocial.
            </p>
            <h3 style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: '#2563eb',
              marginBottom: 20,
              lineHeight: 2,
            }}>
              THE DEVCEPTION DIFFERENCE
            </h3>
            <p style={{ marginBottom: 20 }}>
              Devception didn&apos;t start from the question &quot;how do we make coding more educational?&quot; It started from the question &quot;how do we make coding genuinely fun?&quot; The two answers turned out to be the same.
            </p>
            <p style={{ marginBottom: 20 }}>
              When you introduce <strong style={{ color: '#e0e0e0' }}>social deduction mechanics</strong> into a coding environment, something extraordinary happens: players become more alert, more analytical, and more engaged. You start noticing patterns in how people write code. You start paying attention to who makes changes during critical moments. You start <strong style={{ color: '#e0e0e0' }}>thinking about code as behavior</strong>, not just syntax.
            </p>
            <p style={{ marginBottom: 20 }}>
              This is a higher-order cognitive skill than simply solving the correct algorithm. It&apos;s the skill of <strong style={{ color: '#e0e0e0' }}>reading a codebase like a detective</strong> reads a crime scene.
            </p>
            <p style={{ marginBottom: 20 }}>
              Players who spend time in Devception report that they become more attentive code reviewers in their professional lives. They learn to spot suspicious commits, unusual refactors, and subtle logic errors — because they&apos;ve spent hours playing a game where those same things were weapons.
            </p>
            <p>
              <strong style={{ color: '#2563eb' }}>This is coding for people who love games. Games for people who love coding. And a new kind of experience for everyone in between.</strong>
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          #why .section-container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

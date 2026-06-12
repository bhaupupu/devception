'use client';
import React from 'react';

const ROADMAP = [
  { phase: 'Q1 2025', items: ['Public beta launch', 'Community Discord live', 'Global leaderboard system'] },
  { phase: 'Q2 2025', items: ['Tournament infrastructure', 'Custom challenge builder', 'Team accounts & squads'] },
  { phase: 'Q3 2025', items: ['Mobile-responsive overhaul', 'Language expansion (Go, Rust)', 'Spectator mode'] },
  { phase: 'Q4 2025', items: ['VS Code extension', 'University partnerships', 'API for custom integrations'] },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: '100px 0',
        borderTop: '1px solid rgba(37,99,235,0.2)',
        background: 'rgba(37,99,235,0.02)',
      }}
    >
      <div className="section-container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label-yellow">// CLASSIFIED — ORIGINS</div>
          <h2 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(14px, 2vw, 24px)',
            color: '#fff',
            lineHeight: 1.6,
          }}>
            ABOUT DEVCEPTION
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 60, alignItems: 'start' }}>
          {/* Long-form copy */}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#a0a0a0', lineHeight: 1.9 }}>
            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#ca8a04', marginBottom: 20, lineHeight: 2 }}>
              ORIGIN STORY
            </h3>
            <p style={{ marginBottom: 20 }}>
              Devception was born from a late-night Discord conversation between two developers who had just finished a session of Among Us and thought: <em style={{ color: '#e0e0e0' }}>"What if the tasks were real code?"</em> That single question — asked somewhere between midnight and 2AM — became the seed of everything you see today.
            </p>
            <p style={{ marginBottom: 20 }}>
              The founding team spent months prototyping ideas, discarding concepts that felt too mechanical, and slowly landing on a design that preserved the raw tension of social deduction while grounding it in something real: <strong style={{ color: '#e0e0e0' }}>actual programming challenges</strong>. The first playable prototype ran in a browser with a shared textarea, a 15-minute timer, and an imposter randomly chosen from five friends. The chaos that ensued — the accusations, the laughter, the genuine debate about whose commit broke the function — told the team they were onto something.
            </p>

            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#ca8a04', marginBottom: 20, lineHeight: 2 }}>
              INSPIRATION
            </h3>
            <p style={{ marginBottom: 20 }}>
              Devception draws from many worlds. From <strong style={{ color: '#e0e0e0' }}>Among Us</strong>, it borrows the imposter mechanic and the drama of an Emergency Meeting. From <strong style={{ color: '#e0e0e0' }}>VS Code</strong> and collaborative coding tools, it borrows the shared editor experience. From <strong style={{ color: '#e0e0e0' }}>Hacknet and classic terminal games</strong>, it borrows the aesthetic — the feeling that you are inside a system, not just playing with one. And from <strong style={{ color: '#e0e0e0' }}>competitive programming</strong>, it borrows the intellectual rigor that makes the challenges genuinely difficult and rewarding.
            </p>
            <p style={{ marginBottom: 20 }}>
              The visual identity — monospace everywhere, pixel fonts, dark backgrounds, sharp borders, grid overlays — was a deliberate choice to make the experience feel <strong style={{ color: '#e0e0e0' }}>authentically developer-native</strong>. This is not a game designed to look like a game designed for developers. This is a game designed by developers, for developers, that happens to look exactly like the tools developers love.
            </p>

            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#ca8a04', marginBottom: 20, lineHeight: 2 }}>
              OUR VISION
            </h3>
            <p style={{ marginBottom: 20 }}>
              Our vision is a world where developer entertainment and developer education are the same thing. Where the hours you spend playing Devception make you a sharper coder, a better communicator, and a more perceptive teammate — not as a side effect, but as a direct consequence of the game&apos;s design.
            </p>
            <p style={{ marginBottom: 20 }}>
              We believe that the future of technical community-building is interactive, competitive, and deeply social. Hackathons, coding competitions, and pair programming sessions are all gestures in this direction — Devception is the game that lives in that space permanently.
            </p>

            <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#ca8a04', marginBottom: 20, lineHeight: 2 }}>
              COMMUNITY GOALS
            </h3>
            <p style={{ marginBottom: 20 }}>
              Devception is free. Not freemium. Not free-to-start. Free. We believe access to this kind of collaborative developer experience should not be gated. Our community goals are simple: build the largest developer gaming community in the world, host regular competitive events, and create a space where beginner developers feel empowered to play alongside experienced engineers — because in Devception, social intelligence can outpace technical skill, and that&apos;s exactly the point.
            </p>
            <p>
              <strong style={{ color: '#2563eb' }}>Join us. The imposter is already waiting.</strong>
            </p>
          </div>

          {/* Roadmap */}
          <div>
            <div style={{
              border: '2px solid rgba(202,138,4,0.4)',
              background: '#0d0b00',
              padding: 24,
            }}>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: '#ca8a04',
                marginBottom: 24,
                letterSpacing: '0.15em',
              }}>
                ▌ FUTURE ROADMAP
              </div>

              {ROADMAP.map((phase, i) => (
                <div key={phase.phase} style={{ marginBottom: i < ROADMAP.length - 1 ? 24 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      border: '2px solid #ca8a04',
                      background: i === 0 ? '#ca8a04' : 'transparent',
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 8,
                      color: i === 0 ? '#ca8a04' : '#666',
                    }}>
                      {phase.phase}
                    </span>
                  </div>
                  <div style={{ paddingLeft: 22 }}>
                    {phase.items.map((item) => (
                      <div key={item} style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 11,
                        color: i === 0 ? '#a0a0a0' : '#555',
                        lineHeight: 1.9,
                      }}>
                        {i === 0 ? '▶' : '○'} {item}
                      </div>
                    ))}
                  </div>
                  {i < ROADMAP.length - 1 && (
                    <div style={{ marginLeft: 4, marginTop: 4, width: 2, height: 16, background: 'rgba(202,138,4,0.3)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{
              border: '2px solid rgba(37,99,235,0.3)',
              background: '#0d1117',
              padding: 24,
              marginTop: 16,
            }}>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: '#2563eb',
                marginBottom: 16,
                letterSpacing: '0.15em',
              }}>
                ▌ PROJECT VITALS
              </div>
              {[
                ['Status', '■ ACTIVE DEVELOPMENT'],
                ['Version', 'v1.0.0-beta'],
                ['License', 'MIT Open Source'],
                ['Team Size', '3 core engineers'],
                ['Founded', '2024'],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  paddingBottom: 8,
                  marginBottom: 8,
                  borderBottom: '1px solid rgba(37,99,235,0.1)',
                  color: '#a0a0a0',
                }}>
                  <span style={{ color: '#555' }}>{k}:</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          #about .section-container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

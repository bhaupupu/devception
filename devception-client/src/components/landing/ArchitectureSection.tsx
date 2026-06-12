'use client';
import React from 'react';

const NODES = [
  { label: 'PLAYER A\nDEVELOPER', color: '#16a34a', sub: 'role: good coder' },
  { label: 'PLAYER B\n??? ', color: '#dc2626', sub: 'role: imposter' },
  { label: 'PLAYER C\nDEVELOPER', color: '#16a34a', sub: 'role: good coder' },
  { label: 'PLAYER D\nDEVELOPER', color: '#16a34a', sub: 'role: good coder' },
  { label: 'PLAYER E\nDEVELOPER', color: '#16a34a', sub: 'role: good coder' },
  { label: 'PLAYER F\nDEVELOPER', color: '#16a34a', sub: 'role: good coder' },
];

const FLOW = [
  { label: 'GAME ROOM', color: '#2563eb', desc: 'Encrypted session · Room code · Player registry' },
  { label: 'CODE CHALLENGE', color: '#ca8a04', desc: 'Shared editor · Real-time sync · Multi-module problem' },
  { label: 'MINI TASKS', color: '#16a34a', desc: 'Individual assignments · Progress contribution · XP rewards' },
  { label: 'EMERGENCY MEETING', color: '#dc2626', desc: 'Chat opens · Accusations · Anonymous vote' },
  { label: 'VOTING', color: '#7c3aed', desc: 'Elimination · Role reveal · Game state update' },
  { label: 'RESULT', color: '#2563eb', desc: 'Win/Loss declared · Stats recorded · Rematch option' },
];

export default function ArchitectureSection() {
  return (
    <section
      id="architecture"
      style={{
        padding: '100px 0',
        borderTop: '1px solid rgba(37,99,235,0.2)',
      }}
    >
      <div className="section-container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label">// SYSTEM ARCHITECTURE</div>
          <h2 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(14px, 2vw, 24px)',
            color: '#fff',
            lineHeight: 1.6,
          }}>
            CLASSIFIED BLUEPRINT
          </h2>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            color: '#666',
            marginTop: 12,
            letterSpacing: '0.08em',
          }}>
            DOCUMENT: DCPTN-ARCH-001 · CLEARANCE LEVEL: SECRET · REV 4.2
          </p>
        </div>

        <div style={{
          border: '2px solid rgba(37,99,235,0.4)',
          background: '#080d14',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Blueprint grid overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Players row */}
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: '#2563eb',
              textAlign: 'center',
              marginBottom: 12,
              letterSpacing: '0.2em',
            }}>
              ▌ CONNECTED AGENTS
            </div>
            <div style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'center',
              marginBottom: 8,
              flexWrap: 'wrap',
            }}>
              {NODES.map((node) => (
                <div
                  key={node.label}
                  style={{
                    border: `2px solid ${node.color}`,
                    padding: '8px 12px',
                    textAlign: 'center',
                    background: `${node.color}10`,
                    minWidth: 100,
                  }}
                >
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    color: node.color,
                    lineHeight: 1.8,
                    whiteSpace: 'pre-line',
                  }}>
                    {node.label}
                  </div>
                  <div style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9,
                    color: '#555',
                    marginTop: 4,
                  }}>
                    {node.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Arrow down */}
            <div style={{
              textAlign: 'center',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 16,
              color: '#2563eb',
              margin: '8px 0',
            }}>
              ↓
            </div>

            {/* Socket.IO label */}
            <div style={{
              textAlign: 'center',
              margin: '0 auto 8px',
              display: 'inline-block',
              width: '100%',
            }}>
              <span style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 7,
                color: '#666',
                border: '1px dashed #333',
                padding: '4px 16px',
                display: 'inline-block',
              }}>
                SOCKET.IO REAL-TIME BRIDGE · ENCRYPTED · LOW LATENCY
              </span>
            </div>

            <div style={{ textAlign: 'center', color: '#2563eb', fontSize: 16, marginBottom: 8 }}>↓</div>

            {/* Flow nodes */}
            {FLOW.map((node, i) => (
              <React.Fragment key={node.label}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  maxWidth: 600,
                  margin: '0 auto',
                }}>
                  <div style={{
                    flex: 1,
                    border: `2px solid ${node.color}`,
                    padding: '14px 20px',
                    background: '#0d1117',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      color: node.color,
                    }}>
                      {node.label}
                    </span>
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 10,
                      color: '#555',
                    }}>
                      {node.desc}
                    </span>
                  </div>
                </div>
                {i < FLOW.length - 1 && (
                  <div style={{ textAlign: 'center', color: `${FLOW[i + 1].color}`, fontSize: 16, margin: '4px 0' }}>
                    ↓
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Tech stack footer */}
            <div style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: '1px solid rgba(37,99,235,0.2)',
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              flexWrap: 'wrap',
            }}>
              {[
                'NEXT.JS 14',
                'SOCKET.IO',
                'EXPRESS',
                'NODE.JS',
                'NEXT-AUTH',
                'FRAMER MOTION',
              ].map((tech) => (
                <span key={tech} style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: '#555',
                  border: '1px solid #222',
                  padding: '4px 10px',
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

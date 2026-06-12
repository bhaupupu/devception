'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const OS_MENU = [
  { key: '1', label: 'CREATE ROOM', desc: 'Initialize a new secure game session and generate your room code.', action: '/play', color: '#16a34a' },
  { key: '2', label: 'JOIN ROOM', desc: 'Enter an existing room code and deploy into an active match.', action: '/play', color: '#2563eb' },
  { key: '3', label: 'FIND IMPOSTER', desc: 'View the detective\'s guide and tips for identifying suspicious behavior.', action: '#how-it-works', color: '#dc2626' },
  { key: '4', label: 'VIEW LEADERBOARD', desc: 'Access the global rankings and see the top agents worldwide.', action: '#community', color: '#ca8a04' },
  { key: '5', label: 'PLAY NOW', desc: 'Skip the briefing. Enter the mission. Trust no one.', action: '/play', color: '#7c3aed' },
];

export default function FakeOSSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const [bootLines, setBootLines] = useState([
    'DEVCEPTION OS v1.0.7 [RETRO BUILD]',
    'Copyright (c) 2024 Devception Corp. All rights reserved.',
    '',
    'Initializing game kernel...',
    'Loading player registry...    OK',
    'Establishing Socket.IO bridge...    OK',
    'Mounting challenge database...    OK',
    'Starting social deduction engine...    OK',
    '',
    '[ SYSTEM READY ]',
    '',
    'Select an option below to continue:',
  ]);

  return (
    <section
      id="os"
      style={{
        padding: '100px 0',
        borderTop: '1px solid rgba(37,99,235,0.2)',
        background: 'rgba(22,163,74,0.02)',
      }}
    >
      <div className="section-container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label" style={{ color: '#16a34a', borderColor: '#16a34a' }}>
            // OPERATING SYSTEM
          </div>
          <h2 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(14px, 2vw, 24px)',
            color: '#fff',
            lineHeight: 1.6,
          }}>
            DEVCEPTION OS
          </h2>
        </div>

        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="os-window">
            {/* Title bar */}
            <div className="os-titlebar">
              <span>DEVCEPTION OS v1.0 — SECURE TERMINAL</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ cursor: 'pointer' }}>_</span>
                <span style={{ cursor: 'pointer' }}>□</span>
                <span style={{ cursor: 'pointer' }}>✕</span>
              </div>
            </div>

            {/* OS body */}
            <div className="os-body">
              {/* Boot sequence */}
              {bootLines.map((line, i) => (
                <div key={i} style={{
                  color: line.includes('OK') ? '#16a34a' : line.includes('READY') ? '#fff' : '#16a34a',
                  fontWeight: line.includes('READY') ? 700 : 400,
                  fontSize: line.includes('DEVCEPTION OS') ? 14 : 13,
                }}>
                  {line || '\u00a0'}
                </div>
              ))}

              {/* Menu */}
              <div style={{ marginTop: 16 }}>
                {OS_MENU.map((item) => (
                  <div key={item.key}>
                    <button
                      onClick={() => setSelected(selected === item.key ? null : item.key)}
                      className="os-menu-item"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        color: selected === item.key ? item.color : '#00ff41',
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 13,
                        display: 'flex',
                        gap: 16,
                      }}
                    >
                      <span style={{ color: item.color }}>
                        {selected === item.key ? '>' : ' '} [{item.key}]
                      </span>
                      <span>{item.label}</span>
                    </button>

                    {selected === item.key && (
                      <div style={{
                        paddingLeft: 40,
                        paddingBottom: 12,
                        color: '#888',
                        fontSize: 12,
                        fontFamily: "'Space Mono', monospace",
                      }}>
                        <div style={{ marginBottom: 8 }}>{item.desc}</div>
                        <Link
                          href={item.action}
                          style={{
                            color: item.color,
                            textDecoration: 'none',
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: 8,
                            border: `1px solid ${item.color}`,
                            padding: '6px 14px',
                            display: 'inline-block',
                            letterSpacing: '0.1em',
                          }}
                        >
                          EXECUTE →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Prompt */}
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#16a34a' }}>DCPTN:~$</span>
                <span style={{ color: '#16a34a' }}>_</span>
                <span style={{
                  display: 'inline-block',
                  width: 9,
                  height: 14,
                  background: '#16a34a',
                  animation: 'blink-cursor 1s step-end infinite',
                }} />
              </div>
            </div>
          </div>

          <p style={{
            textAlign: 'center',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7,
            color: '#333',
            marginTop: 12,
            letterSpacing: '0.1em',
          }}>
            DEVCEPTION OS — RETRO INTERFACE BUILD · ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </section>
  );
}

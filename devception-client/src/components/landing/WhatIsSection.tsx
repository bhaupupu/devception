'use client';
import React from 'react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: '⚡',
    label: 'REAL-TIME',
    desc: 'Every keystroke synced live across all players in milliseconds.',
  },
  {
    icon: '🕵️',
    label: 'SOCIAL DEDUCTION',
    desc: 'Identify the imposter before time runs out or the codebase is sabotaged.',
  },
  {
    icon: '💻',
    label: 'LIVE CODING',
    desc: 'Real programming challenges — not trivia, not quizzes, actual code.',
  },
];

const FEATURE_PILLS = ['REAL CODE', 'REAL DECEPTION', 'REAL FUN'];

export default function WhatIsSection() {
  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .what-is-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section
        id="what-is"
        style={{
          padding: '100px 0',
          background: '#faf8f4',
          borderTop: '3px solid #1c1917',
          position: 'relative',
        }}
      >
        {/* Subtle blueprint grid within section */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: [
              'linear-gradient(rgba(37,99,235,0.03) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(37,99,235,0.03) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '24px 24px',
          }}
        />

        <motion.div
          className="section-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Section label */}
          <div className="section-label" style={{ marginBottom: 12 }}>
            [WHAT IS DEVCEPTION]
          </div>

          {/* Main heading */}
          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(13px, 2vw, 22px)',
              color: '#1c1917',
              lineHeight: 1.7,
              marginBottom: 52,
            }}
          >
            A GAME OF CODE{' '}
            <span style={{ color: '#2563eb' }}>AND DECEPTION</span>
          </h2>

          {/* Two-column grid */}
          <div
            className="what-is-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 60,
              alignItems: 'start',
            }}
          >
            {/* LEFT — intro + feature rows */}
            <div>
              {/* Mission summary panel */}
              <div
                style={{
                  border: '3px solid #1c1917',
                  borderLeft: '6px solid #2563eb',
                  padding: 24,
                  marginBottom: 28,
                  background: '#f0ece2',
                  boxShadow: '4px 4px 0 #1c1917',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 8,
                    color: '#2563eb',
                    marginBottom: 14,
                    lineHeight: 2,
                  }}
                >
                  MISSION SUMMARY
                </p>
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 13,
                    color: '#44403c',
                    lineHeight: 1.9,
                    margin: 0,
                  }}
                >
                  Devception is not a coding tutorial. It&apos;s not a practice platform. It&apos;s
                  not another competitive programming judge. It is a{' '}
                  <strong style={{ color: '#1c1917' }}>
                    live multiplayer social deduction game
                  </strong>{' '}
                  built for developers who crave more than isolated problem-solving.
                </p>
              </div>

              {/* Feature rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {FEATURES.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      gap: 16,
                      padding: '16px',
                      border: '2px solid #1c1917',
                      background: '#faf8f4',
                      boxShadow: '3px 3px 0 #1c1917',
                      transition: 'transform 0.1s, box-shadow 0.1s',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = 'translate(-1px, -1px)';
                      el.style.boxShadow = '4px 4px 0 #1c1917';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.transform = 'translate(0, 0)';
                      el.style.boxShadow = '3px 3px 0 #1c1917';
                    }}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 7,
                          color: '#2563eb',
                          marginBottom: 8,
                          letterSpacing: '0.1em',
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 11,
                          color: '#44403c',
                          lineHeight: 1.7,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature pills */}
              <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
                {FEATURE_PILLS.map((pill) => (
                  <span
                    key={pill}
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 7,
                      color: '#1c1917',
                      border: '2px solid #1c1917',
                      background: '#f0ece2',
                      padding: '6px 14px',
                      display: 'inline-block',
                      letterSpacing: '0.08em',
                      boxShadow: '2px 2px 0 #1c1917',
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT — long-form editorial content */}
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                color: '#44403c',
                lineHeight: 1.9,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 9,
                  color: '#92400e',
                  marginBottom: 16,
                  lineHeight: 2,
                }}
              >
                THE PROBLEM WITH TRADITIONAL CODING GAMES
              </h3>
              <p style={{ marginBottom: 20 }}>
                Most coding games are fundamentally{' '}
                <strong style={{ color: '#1c1917' }}>solo experiences</strong>. You sit in front
                of a compiler, grind through problems ranked by difficulty, and receive a score.
                There is no communication, no collaboration, no deception, and no tension. You are
                essentially playing solitaire with algorithms.
              </p>
              <p style={{ marginBottom: 28 }}>
                Competitive programming platforms like LeetCode, HackerRank, and Codeforces are
                excellent tools — but they were designed for individual skill development, not the
                kind of{' '}
                <strong style={{ color: '#1c1917' }}>emergent social dynamics</strong> that make
                games genuinely memorable and replayable.
              </p>

              <h3
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 9,
                  color: '#92400e',
                  marginBottom: 16,
                  lineHeight: 2,
                }}
              >
                WHY CODING IS MORE FUN SOCIALLY
              </h3>
              <p style={{ marginBottom: 20 }}>
                Professional software development is, at its core, a{' '}
                <strong style={{ color: '#1c1917' }}>team sport</strong>. Real codebases are built
                by multiple engineers who must communicate, review each other&apos;s work, catch
                bugs, and coordinate on shared architecture.
              </p>
              <p style={{ marginBottom: 28 }}>
                When you code alongside others — when you can see someone else&apos;s cursor
                moving, watch a function being written in real time — you enter a completely
                different cognitive and emotional state. Ideas spark faster. Mistakes become shared
                learning moments. Progress feels tangible and collective.
              </p>

              <h3
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 9,
                  color: '#92400e',
                  marginBottom: 16,
                  lineHeight: 2,
                }}
              >
                WHY SOCIAL DEDUCTION CREATES TENSION
              </h3>
              <p style={{ marginBottom: 20 }}>
                Social deduction games like Among Us proved something remarkable: the mechanics of{' '}
                <strong style={{ color: '#1c1917' }}>trust, observation, and accusation</strong>{' '}
                create some of the most gripping gaming experiences ever conceived. The moment you
                suspect a teammate — the way they hesitate before deleting a line — your entire
                perception of the match shifts.
              </p>
              <p>
                Devception fuses this with coding. Every edit is potential evidence. Every function
                added could be a silent sabotage. The coding challenge is the arena.{' '}
                <strong style={{ color: '#2563eb' }}>The social deduction is the actual game.</strong>
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

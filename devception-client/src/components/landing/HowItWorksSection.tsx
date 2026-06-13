'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PHASES = [
  {
    number: '01',
    title: 'CREATE ROOM',
    subtitle: 'OPERATION: INITIATION',
    color: '#2563eb',
    icon: '🏠',
    content: `The mission begins when an agent creates a secure game room. You select your preferred programming language — Python, JavaScript, or C++ — and set the difficulty level (Beginner, Intermediate, or Advanced). The system generates a unique encrypted room code that you share with your team. As the room creator, you control the lobby: you can set the maximum number of players (4–8), configure the match timer, and monitor who joins. The room exists in a standby state until the minimum player threshold is reached, at which point the launch sequence is initiated. Think of this as your secure operations base — classified, controlled, and ready for deployment.`,
  },
  {
    number: '02',
    title: 'ASSEMBLE TEAM',
    subtitle: 'OPERATION: RECRUITMENT',
    color: '#16a34a',
    icon: '👥',
    content: `Players join the room using the encrypted room code shared by the creator. As agents enter the lobby, their avatars appear in the staging area. The lobby displays each player's name, skill indicator, and chosen language. Players can see who's in the room but cannot yet see roles — no one knows who will be the imposter. The chat is open during this phase, allowing the team to coordinate and strategize before the mission begins. Once the minimum player count is reached and the creator initiates launch, the team is locked in. There's no turning back. The operation is go.`,
  },
  {
    number: '03',
    title: 'ASSIGN SECRET ROLES',
    subtitle: 'OPERATION: CLASSIFICATION',
    color: '#ca8a04',
    icon: '🎭',
    content: `The most critical moment of the setup phase: role assignment. The server randomly designates one or two players as imposters — the exact number scales with room size. Every other player receives the Good Coder designation. Roles are displayed privately to each player via an encrypted modal. Good Coders see: "ROLE: DEVELOPER — Collaborate. Complete the mission. Find the imposter." Imposters see: "ROLE: IMPOSTER — Sabotage the code. Avoid detection. Win." No one else can see your role assignment. This is the last moment of certainty. From here, trust becomes a strategy, not a given. The game clock starts immediately after all players confirm their roles.`,
  },
  {
    number: '04',
    title: 'CODE TOGETHER',
    subtitle: 'OPERATION: COLLABORATION',
    color: '#2563eb',
    icon: '💻',
    content: `The game is live. All players share a synchronized code editor where a pre-set programming challenge awaits. The challenge is modular and complex — multiple functions, logical dependencies, intentional bugs, and incomplete components. Good Coders work collaboratively to fix, complete, and optimize the code. They also receive individual mini-tasks in their personal task panel: fix this specific bug, complete this function, debug this snippet. Completing tasks fills the team's shared progress bar. Meanwhile, imposters pose as helpful contributors while secretly inserting bugs, triggering sabotage events, or sending misleading hints. Every change in the shared editor is visible to all players in real time. Watch the cursors. Watch the edits. The imposter is active.`,
  },
  {
    number: '05',
    title: 'FIND THE IMPOSTER',
    subtitle: 'OPERATION: EXTRACTION',
    color: '#dc2626',
    icon: '🕵️',
    content: `At any point during the match, any player can call an Emergency Meeting. All coding pauses. The chat opens fully. Players discuss suspicious behavior — who edited that function incorrectly? Who added that rogue loop? Who was idle during the critical section? Evidence is presented. Accusations are made. After a timed discussion, a vote is cast. The player with the most votes is eliminated and removed from the match. If the eliminated player is the imposter, Good Coders win instantly. If an innocent developer is eliminated, the game resumes with the team now one member shorter. The tension escalates. The imposter grows bolder. Or does the evidence trail lead to their exposure? Only one outcome is possible. Mission complete — or mission failed.`,
  },
];

export default function HowItWorksSection() {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <section
      id="how-it-works"
      style={{
        padding: '100px 0',
        borderTop: '2px solid rgba(28,25,23,0.12)',
      }}
    >
      <motion.div
        className="section-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: '#2563eb',
              letterSpacing: '0.15em',
              marginBottom: 16,
            }}
          >
            // MISSION TIMELINE
          </div>
          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(16px, 2.2vw, 26px)',
              color: '#1c1917',
              lineHeight: 1.6,
            }}
          >
            HOW IT WORKS
          </h2>
        </div>

        {/* Phase selector tabs */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            marginBottom: 32,
            border: '3px solid #1c1917',
            boxShadow: '4px 4px 0 #1c1917',
            overflow: 'hidden',
            flexWrap: 'wrap',
          }}
        >
          {PHASES.map((phase, i) => (
            <button
              key={phase.number}
              onClick={() => setActivePhase(i)}
              style={{
                flex: 1,
                minWidth: 100,
                padding: '14px 8px',
                background: activePhase === i ? phase.color : '#faf8f4',
                border: 'none',
                borderRight: i < PHASES.length - 1 ? '2px solid #1c1917' : 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 18 }}>{phase.icon}</span>
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: activePhase === i ? '#fff' : '#44403c',
                  lineHeight: 1.6,
                  textAlign: 'center',
                }}
              >
                PHASE {phase.number}
              </span>
            </button>
          ))}
        </div>

        {/* Active phase detail */}
        {PHASES.map((phase, i) => (
          <div
            key={phase.number}
            style={{
              display: activePhase === i ? 'block' : 'none',
              background: '#faf8f4',
              border: `3px solid ${phase.color}`,
              boxShadow: `4px 4px 0 ${phase.color}55`,
              padding: 40,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Phase number watermark */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                right: 24,
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 80,
                color: `${phase.color}15`,
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {phase.number}
            </div>

            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: phase.color,
                marginBottom: 10,
                letterSpacing: '0.15em',
              }}
            >
              {phase.subtitle}
            </div>

            <h3
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'clamp(13px, 2vw, 20px)',
                color: '#1c1917',
                marginBottom: 24,
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: phase.color }}>PHASE {phase.number}</span> — {phase.title}
            </h3>

            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                color: '#44403c',
                lineHeight: 1.9,
                maxWidth: 780,
                position: 'relative',
                zIndex: 1,
              }}
            >
              {phase.content}
            </p>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
              {i > 0 && (
                <button
                  onClick={() => setActivePhase(i - 1)}
                  className="pixel-btn pixel-btn-light"
                >
                  ← PREV PHASE
                </button>
              )}
              {i < PHASES.length - 1 && (
                <button
                  onClick={() => setActivePhase(i + 1)}
                  className="pixel-btn pixel-btn-blue"
                >
                  NEXT PHASE →
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Bottom timeline track */}
        <div
          style={{
            marginTop: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            padding: '0 20px',
          }}
        >
          {PHASES.map((phase, i) => (
            <React.Fragment key={phase.number}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  border: `3px solid ${phase.color}`,
                  background: activePhase >= i ? phase.color : 'transparent',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => setActivePhase(i)}
                title={`Phase ${phase.number}: ${phase.title}`}
              />
              {i < PHASES.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    background: activePhase > i ? '#2563eb' : 'rgba(28,25,23,0.15)',
                    transition: 'background 0.3s',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DOSSIERS = [
  {
    id: '001',
    role: 'DEVELOPER',
    color: '#2563eb',
    clearance: 'ALPHA',
    icon: '👨‍💻',
    mission: 'Collaborate, complete the challenge, and expose the imposter before time expires.',
    sections: [
      {
        title: 'PRIMARY MISSION',
        content: `Your mission is deceptively straightforward: write good code. You and your fellow developers are tasked with collaborating on a shared, multi-module coding challenge within the time limit. The challenge is complex enough that teamwork is essential — no single developer can complete it alone. You must communicate, coordinate, and contribute. Beyond the main codebase, you receive individual mini-tasks in your personal task panel. These are smaller, focused problems — fix a specific bug, complete a function, debug a snippet. Every mini-task you complete fills the team's shared progress bar, bringing the group closer to victory. Your code is your contribution. Your activity is your alibi.`,
      },
      {
        title: 'STRATEGIC OBJECTIVES',
        content: `Winning as a developer requires more than just coding skill. You must remain vigilant. Observe your teammates' behavior. When someone edits a working function incorrectly, note it. When the progress bar drops unexpectedly, investigate. Watch for players who appear active but contribute nothing meaningful. Look for suspicious idle periods, strange code additions, or unusual hesitation before critical actions. The best developers in Devception are those who can code and observe simultaneously — maintaining their own output while passively tracking anomalous behavior across the team.`,
      },
      {
        title: 'WIN CONDITIONS',
        content: `Developers win in two scenarios. First: complete the main coding challenge before the match timer expires. If the shared progress bar reaches 100% and the code passes validation, the team wins — regardless of whether the imposter was identified. Second: correctly identify and vote out the imposter during an Emergency Meeting. If the voted player is revealed to be the imposter, Good Coders win instantly. The imposter doesn't need to be caught coding badly — they just need to be caught. Use evidence from the shared editor, the chat logs, and your own observations to build your case.`,
      },
    ],
  },
  {
    id: '002',
    role: 'IMPOSTER',
    color: '#dc2626',
    clearance: 'OMEGA',
    icon: '🕵️',
    mission: 'Sabotage the codebase, sow distrust, and avoid exposure until time runs out.',
    sections: [
      {
        title: 'PRIMARY MISSION',
        content: `You are the anomaly. While the rest of the team believes they're working toward a common goal, your objective is the opposite: prevent that goal from being reached. You have full access to the shared code editor, which is both your greatest weapon and your greatest vulnerability. Every edit you make is visible to the entire team. You must sabotage intelligently — not obviously. Insert bugs that look like honest mistakes. Delete small but critical lines. Break functions in ways that might not be immediately noticed. The imposter who survives longest is the one who appears to be contributing while actually undermining progress at every turn.`,
      },
      {
        title: 'DECEPTION TACTICS',
        content: `The art of being an imposter in Devception is social, not technical. You must maintain the illusion of participation. Type in the editor, even if what you write is slightly wrong. Participate in chat. Agree with other players' observations. When someone calls an Emergency Meeting, immediately accuse someone else — ideally a player who has been quiet or less active. Redirect suspicion. Use the chat to gaslight. "I saw Player D change that function twice" is far more effective than silence. Create doubt. The moment two developers disagree about who to vote for, you've already won that round.`,
      },
      {
        title: 'WIN CONDITIONS',
        content: `Imposters win in two scenarios. First: if time expires before the team completes the main coding challenge. Every tick of the countdown is your ally. Every bug you successfully plant, every function you break, every progress bar regression is a step toward victory. Second: if a Good Coder is voted out during an Emergency Meeting, the game continues with your odds improved. Repeat this until there are too few developers to complete the challenge. You don't win by being caught — you win by never being caught. Play the long game. Code enough to look legitimate. Betray when it counts.`,
      },
    ],
  },
];

export default function RoleDossiersSection() {
  const [active, setActive] = useState<{ role: string; section: number } | null>(null);

  return (
    <section
      id="roles"
      style={{
        padding: '100px 0',
        borderTop: '2px solid rgba(28,25,23,0.12)',
        background: '#faf8f4',
        backgroundImage: `
          linear-gradient(rgba(28,25,23,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(28,25,23,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
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
              color: '#dc2626',
              letterSpacing: '0.15em',
              marginBottom: 16,
            }}
          >
            // CLASSIFIED PERSONNEL FILES
          </div>
          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(14px, 2vw, 24px)',
              color: '#1c1917',
              lineHeight: 1.6,
            }}
          >
            ROLE DOSSIERS
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 32,
          }}
        >
          {DOSSIERS.map((dossier) => (
            <div
              key={dossier.id}
              style={{
                background: '#fff',
                border: `3px solid ${dossier.color}`,
                boxShadow: `4px 4px 0 ${dossier.color}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Dossier header */}
              <div
                style={{
                  background: dossier.color,
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 7,
                      color: 'rgba(255,255,255,0.85)',
                      letterSpacing: '0.15em',
                      marginBottom: 6,
                    }}
                  >
                    DOSSIER #{dossier.id} · CLEARANCE: {dossier.clearance}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 13,
                      color: '#fff',
                    }}
                  >
                    {dossier.icon} {dossier.role}
                  </div>
                </div>
                {/* CLASSIFIED tag */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.6)',
                    padding: '4px 10px',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    color: '#fff',
                    letterSpacing: '0.1em',
                    transform: 'rotate(-1deg)',
                  }}
                >
                  CLASSIFIED
                </div>
              </div>

              {/* Dossier body */}
              <div style={{ padding: 24 }}>
                {/* Mission summary */}
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    color: '#1c1917',
                    background: `${dossier.color}10`,
                    border: `2px solid ${dossier.color}40`,
                    padding: '10px 14px',
                    marginBottom: 24,
                    lineHeight: 1.8,
                  }}
                >
                  <strong style={{ color: dossier.color }}>MISSION:</strong> {dossier.mission}
                </div>

                {/* Accordion sections */}
                {dossier.sections.map((section, i) => {
                  const isOpen = active?.role === dossier.role && active?.section === i;
                  return (
                    <div
                      key={section.title}
                      style={{
                        borderBottom: `2px solid rgba(28,25,23,0.1)`,
                      }}
                    >
                      <button
                        onClick={() =>
                          setActive(isOpen ? null : { role: dossier.role, section: i })
                        }
                        style={{
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '14px 0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          textAlign: 'left',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: 8,
                            color: isOpen ? dossier.color : '#44403c',
                            lineHeight: 1.6,
                          }}
                        >
                          {section.title}
                        </span>
                        <span
                          style={{
                            color: dossier.color,
                            fontFamily: 'monospace',
                            fontSize: 18,
                            lineHeight: 1,
                          }}
                        >
                          {isOpen ? '▲' : '▼'}
                        </span>
                      </button>
                      {isOpen && (
                        <div
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 12,
                            color: '#44403c',
                            lineHeight: 1.9,
                            paddingBottom: 16,
                          }}
                        >
                          {section.content}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Footer watermark */}
                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 14,
                    borderTop: `2px solid rgba(28,25,23,0.1)`,
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    color: '#a0a0a0',
                    letterSpacing: '0.1em',
                  }}
                >
                  DEVCEPTION INTEL BUREAU · EYES ONLY · DCPTN-{dossier.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          #roles .section-container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FAQS = [
  {
    q: 'What exactly is Devception?',
    a: 'Devception is a real-time multiplayer social deduction coding game. 4–8 players join a shared game room, collaborate on a programming challenge, and attempt to identify a hidden imposter among their team — all within a 15–20 minute match. Think Among Us, but the tasks are real code and the stakes are your trust in your teammates.',
  },
  {
    q: 'Do I need to be a good programmer to play?',
    a: "Not necessarily. Devception offers Beginner, Intermediate, and Advanced difficulty levels. At beginner level, challenges are approachable even for newer developers. The social deduction aspect means that strong communication and observation skills can compensate for limited coding experience. Many top-ranked players aren't the best coders in their match — they're the best at reading people.",
  },
  {
    q: 'How does the imposter sabotage without being caught?',
    a: 'Imposters have access to the same shared code editor as everyone else. They can subtly introduce bugs, delete critical lines, or break function logic in ways that look like honest mistakes. The key is plausible deniability — an imposter who makes obvious, catastrophic edits will be caught quickly. The best imposters blend in by editing correctly most of the time, then sabotaging at strategic moments.',
  },
  {
    q: 'What programming languages are supported?',
    a: "Currently Devception supports Python, JavaScript, and C++. We plan to add Go, Rust, TypeScript, and Java in upcoming updates based on community demand. All challenges are language-specific, so you'll always be playing in a language you know.",
  },
  {
    q: 'How many players can be in a single match?',
    a: 'A match requires a minimum of 4 players and supports a maximum of 8 players. The number of imposters scales with player count: 1 imposter for matches of 4–5 players, and 2 imposters for matches of 6–8 players. This ensures the balance between deception and collaboration remains compelling regardless of room size.',
  },
  {
    q: 'Is Devception free to play?',
    a: 'Yes. Devception is completely free to play. All core gameplay features are available to all players at no cost. We may introduce optional cosmetic items in the future (through our in-development shop system), but gameplay will always remain free. We believe competitive access to collaborative developer experiences should not be paywalled.',
  },
  {
    q: 'How does the Emergency Meeting work?',
    a: "Any player can call an Emergency Meeting at any point during the match. When triggered, all coding pauses, the chat opens fully, and a timed discussion phase begins. Players can present evidence, make accusations, and debate. After the discussion ends, an anonymous vote is cast. The player with the most votes is eliminated and their role is revealed. If it's the imposter — Good Coders win. If it's a developer, the game continues.",
  },
  {
    q: 'What are mini-tasks?',
    a: "Mini-tasks are smaller, individual coding assignments given to each player separate from the main challenge. These might include fixing a specific bug, completing a function, or debugging a code snippet. Completing mini-tasks fills the team's shared progress bar, which is one of the conditions for a Good Coder victory. They also serve as a useful gauge — a player who never completes any tasks despite being \"active\" is suspicious.",
  },
  {
    q: 'Can I play with friends in a private room?',
    a: 'Absolutely. Creating a private room generates a unique 6-character room code that you share with your friends. Only players with that code can join the room. You can configure player limits, difficulty level, and programming language before starting. Private rooms are perfect for friend groups, work teams, study groups, or Discord communities.',
  },
  {
    q: 'How is the imposter selected?',
    a: 'The imposter is selected randomly and secretly by the server at the start of each match. Players receive their role assignments privately through an encrypted overlay that only they can see. The selection algorithm is fair and weighted to ensure all players rotate through the imposter role over time, though individual match assignments remain purely random.',
  },
  {
    q: 'What makes the coding challenges interesting for multiple players?',
    a: 'Challenges are specifically designed to be modular and complex enough for 4–8 players to work on simultaneously. A typical challenge might include multiple functions with logical dependencies, intentional bugs in some sections, missing implementations in others, and components that must work together. No single player can reasonably complete it alone within the time limit, which ensures genuine collaboration (and genuine opportunities for sabotage).',
  },
  {
    q: 'Is there a ranking or competitive system?',
    a: 'Yes. Devception features an ELO-style ranking system that tracks your performance across all matches. Points are awarded for wins, successful imposter identifications, accurate votes, completed tasks, and consistent contribution to the shared codebase. Rankings reset each season, and top-ranked players receive recognition on the global leaderboard and in community events.',
  },
  {
    q: 'What technology powers Devception?',
    a: "Devception's frontend is built with Next.js 14 (App Router) with TypeScript and Framer Motion for animations. The backend runs on Node.js with Express. Real-time multiplayer functionality is handled by Socket.IO. Authentication uses NextAuth with Google OAuth. The entire stack is optimized for low-latency real-time interaction.",
  },
  {
    q: 'How long does a typical match last?',
    a: 'Matches are capped at 15 minutes of active coding time. Total session time including the lobby, role assignment, and any Emergency Meetings typically falls between 15–25 minutes. This makes Devception ideal for quick sessions during breaks or longer play sessions with multiple consecutive matches.',
  },
  {
    q: 'Can I spectate a match without playing?',
    a: "Spectator mode is on our roadmap for Q3 2025. In the current version, all room participants must be active players. Once spectator mode launches, observers will be able to watch live matches from a privileged view — seeing all players' code contributions in real time and receiving role reveals that in-game players don't have access to.",
  },
  {
    q: 'Where can I report bugs or suggest features?',
    a: 'Bug reports and feature suggestions are welcome through our GitHub repository. For real-time discussion, our Discord server has dedicated channels for feedback, bug reporting, and feature voting. The development team actively monitors both channels and provides regular updates on the roadmap based on community input.',
  },
  {
    q: 'Is Devception suitable for team building or educational use?',
    a: 'Extremely. Devception has been used by software teams for technical interviews, onboarding sessions, hackathon warm-ups, and developer retreats. Universities and coding bootcamps have begun incorporating it into curricula for its unique blend of collaborative coding and interpersonal communication skill development. The 15-20 minute match format is ideal for structured events.',
  },
  {
    q: 'Will there be more languages, features, and content in the future?',
    a: 'Yes — the roadmap is active and ambitious. Planned additions include additional programming languages (Go, Rust, TypeScript, Java), a custom challenge builder, team accounts, tournament infrastructure, a VS Code extension, university partnership programs, and a mobile-responsive overhaul. Community voting shapes our development priorities. Join Discord to participate.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
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
            // FREQUENTLY ASKED QUESTIONS
          </div>
          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(14px, 2vw, 24px)',
              color: '#1c1917',
              lineHeight: 1.6,
            }}
          >
            INTEL BRIEFING
          </h2>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: '#78716c',
              marginTop: 16,
            }}
          >
            {FAQS.length} answers to your most pressing questions.
          </p>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  borderBottom: '2px solid rgba(28,25,23,0.15)',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: '20px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <span style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1 }}>
                    {/* Q number */}
                    <span
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 8,
                        color: '#2563eb',
                        flexShrink: 0,
                        marginTop: 3,
                      }}
                    >
                      Q{String(i + 1).padStart(2, '0')}
                    </span>
                    {/* Question text */}
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 13,
                        color: isOpen ? '#2563eb' : '#1c1917',
                        lineHeight: 1.7,
                        transition: 'color 0.15s',
                      }}
                    >
                      {faq.q}
                    </span>
                  </span>
                  {/* Toggle icon */}
                  <span
                    style={{
                      color: isOpen ? '#2563eb' : '#78716c',
                      fontSize: 20,
                      lineHeight: 1,
                      flexShrink: 0,
                      marginTop: 2,
                      transition: 'color 0.15s',
                    }}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      paddingLeft: 48,
                      paddingBottom: 20,
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 12,
                      color: '#44403c',
                      lineHeight: 1.9,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

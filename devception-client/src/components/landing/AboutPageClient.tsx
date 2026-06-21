'use client';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCinematic } from './CinematicProvider';
import { AUTHOR } from '@/lib/site';

const VALUES = [
  {
    icon: '🤝',
    title: 'COLLABORATION OVER ISOLATION',
    body: 'Coding was never meant to be a solo sport. The best software is built by teams who communicate, review each other\'s work, and challenge each other\'s assumptions. We built Devception to celebrate that truth.',
    color: '#2563eb',
  },
  {
    icon: '🎮',
    title: 'LEARNING THROUGH PLAY',
    body: 'The best lessons don\'t feel like lessons. When you\'re trying to catch an imposter mid-match, you\'re also practicing code review, critical thinking, and communication under pressure — without even realising it.',
    color: '#16a34a',
  },
  {
    icon: '🔍',
    title: 'TRUST AND BEAUTIFUL BETRAYAL',
    body: 'Trust is the foundation of great teams. And understanding how trust breaks down — through deception, through subtle sabotage — teaches you to build more resilient systems, better communication habits, and sharper instincts.',
    color: '#dc2626',
  },
];

const TEAM = [
  {
    avatar: '👨‍💻',
    name: AUTHOR.name,
    title: AUTHOR.role,
    bio: AUTHOR.bio,
    color: '#2563eb',
  },
  {
    avatar: '👨‍💻',
    name: 'Pratham Sharma',
    title: 'Founder',
    bio: 'Pratham Sharma is a founder of Devception and played a key role in shaping the vision behind the project. From early ideation to refining the gameplay experience, he helped transform a simple classroom idea into a collaborative coding game for developers.',
    color: '#16a34a',
  },
];

// Shared body-paragraph style for the origin story (kept DRY + consistent rhythm).
const STORY_PARAGRAPH: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: 15,
  color: '#44403c',
  lineHeight: 1.85,
  margin: '0 0 20px',
};

export default function AboutPageClient() {
  const [mounted, setMounted] = useState(false);
  const { triggerCinematic } = useCinematic();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ background: '#f0ece2', minHeight: '100vh' }}>
      <Navbar />

      {/* ─── Hero ─── */}
      <section
        className="pixel-bg"
        style={{
          paddingTop: 120,
          paddingBottom: 80,
          textAlign: 'center',
          borderBottom: '3px solid rgba(28,25,23,0.1)',
        }}
      >
        <div className="section-container">
          <div className="section-label">▶ ABOUT DEVCEPTION</div>
          <h1
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(16px, 2.5vw, 28px)',
              color: '#1c1917',
              lineHeight: 1.6,
              marginBottom: 20,
              maxWidth: 800,
              margin: '0 auto 20px',
            }}
          >
            THE STORY BEHIND THE GAME
          </h1>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 16,
              color: '#44403c',
              maxWidth: 600,
              margin: '0 auto',
              lineHeight: 1.8,
            }}
          >
            A game born from boredom, a Discord message, and a better idea for how developers
            should practice their craft.
          </p>
        </div>
      </section>

      {/* ─── Origin Story ─── */}
      <section style={{ padding: 'clamp(56px, 9vw, 80px) 0' }}>
        <div className="section-container">
          {/* Readable measure column (~68 chars/line), centred within the page container */}
          <div
            style={{
              maxWidth: '68ch',
              margin: '0 auto',
              fontFamily: "'Space Mono', monospace",
              fontSize: 15,
            }}
          >
            <div className="section-label">// THE ORIGIN</div>
            <h2
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'clamp(13px, 1.8vw, 20px)',
                color: '#1c1917',
                lineHeight: 1.6,
                margin: '0 0 28px',
              }}
            >
              IT STARTED IN AN ALGORITHMS LECTURE
            </h2>

            <blockquote
              className="game-panel"
              style={{
                padding: 'clamp(20px, 4vw, 36px)',
                margin: '0 0 32px',
                borderLeft: '4px solid #2563eb',
              }}
            >
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 'clamp(15px, 2.2vw, 17px)',
                  color: '#1c1917',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  margin: 0,
                }}
              >
                &ldquo;What if the tasks were actual code?&rdquo;
              </p>
            </blockquote>

            <p style={STORY_PARAGRAPH}>
              It started in an algorithms lecture. A couple of bored computer science students
              stumbled onto a thread about Among Us, and within minutes one message kicked the whole
              thing off: <em>&ldquo;what if the tasks were actual code?&rdquo;</em>
            </p>
            <p style={STORY_PARAGRAPH}>
              That was the whole idea. Simple. Obvious in retrospect. And somehow nobody had done it yet.
            </p>
            <p style={STORY_PARAGRAPH}>
              We spent the rest of that lecture sketching out how it would work: a shared code editor that
              everyone could see and edit simultaneously. One or two hidden imposters whose job was to
              introduce subtle bugs without being caught. An emergency meeting mechanic for calling out
              suspicious behaviour. A voting system to eliminate the suspected imposter.
            </p>
            <p style={STORY_PARAGRAPH}>
              We went home and built the first prototype over a weekend using plain WebSockets and a
              {' '}<code style={{ background: '#e4dfd3', padding: '2px 6px', fontFamily: 'monospace' }}>textarea</code>.
              It was terrible. It crashed constantly, had no authentication, and the code synchronisation
              was basically just &ldquo;last write wins&rdquo; — which caused complete chaos. But when
              we got four of our friends to play it over Discord, something magical happened: everyone was
              laughing, accusing each other, typing furiously, and having the time of their lives.
            </p>
            <p style={{ ...STORY_PARAGRAPH, margin: 0 }}>
              We knew we had something.
            </p>
          </div>
        </div>
      </section>

      {/* ─── The Build ─── */}
      <section
        style={{
          padding: '80px 0',
          background: '#faf8f4',
          borderTop: '2px solid rgba(28,25,23,0.1)',
          borderBottom: '2px solid rgba(28,25,23,0.1)',
        }}
      >
        <div className="section-container" style={{ maxWidth: 900 }}>
          <div className="section-label">⚙ THE BUILD</div>
          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(13px, 1.8vw, 20px)',
              color: '#1c1917',
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            HOW WE BUILT IT
          </h2>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              color: '#44403c',
              lineHeight: 1.9,
              marginBottom: 20,
            }}
          >
            The real version took months. We rebuilt everything from scratch — Next.js 14 for the
            frontend (the App Router made server components and routing elegant), Express with Socket.IO
            for real-time multiplayer (Socket.IO&apos;s room abstraction saved us weeks of work),
            MongoDB for game state persistence, and Y.js CRDTs for conflict-free code editor
            synchronisation across multiple simultaneous writers.
          </p>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              color: '#44403c',
              lineHeight: 1.9,
              marginBottom: 32,
            }}
          >
            The hardest problem was the shared code editor. When 4–8 people type simultaneously, you
            need an algorithm that merges their changes without losing anyone&apos;s work and without
            producing nonsense. We stayed up until 3am more times than we can count. We shipped features
            during study breaks. We tested it with friends and small groups of fellow students —
            anyone who would sit down and play a round with us.
          </p>

          {/* Tech stack badges */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Next.js 14', 'Socket.IO', 'MongoDB', 'Y.js', 'TypeScript', 'NextAuth', 'Express'].map((tech) => (
              <span
                key={tech}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  padding: '6px 12px',
                  background: '#f0ece2',
                  border: '2px solid #1c1917',
                  boxShadow: '2px 2px 0 #1c1917',
                  color: '#1c1917',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Values ─── */}
      <section style={{ padding: '80px 0' }}>
        <div className="section-container">
          <div className="section-label">★ OUR VALUES</div>
          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(13px, 1.8vw, 20px)',
              color: '#1c1917',
              lineHeight: 1.6,
              marginBottom: 40,
            }}
          >
            WHAT WE BELIEVE IN
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {VALUES.map((v, i) => (
              <div
                key={i}
                className="game-panel"
                style={{
                  padding: 28,
                  borderColor: v.color,
                  boxShadow: `4px 4px 0 ${v.color}`,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{v.icon}</div>
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    color: v.color,
                    lineHeight: 1.7,
                    marginBottom: 12,
                  }}
                >
                  {v.title}
                </div>
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    color: '#44403c',
                    lineHeight: 1.8,
                    marginBottom: 0,
                  }}
                >
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Team ─── */}
      <section
        style={{
          padding: '80px 0',
          background: '#faf8f4',
          borderTop: '2px solid rgba(28,25,23,0.1)',
          borderBottom: '2px solid rgba(28,25,23,0.1)',
        }}
      >
        <div className="section-container">
          <div className="section-label">👥 THE TEAM</div>
          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(13px, 1.8vw, 20px)',
              color: '#1c1917',
              lineHeight: 1.6,
              marginBottom: 40,
            }}
          >
            WHO BUILT THIS
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
              maxWidth: 800,
            }}
          >
            {TEAM.map((member, i) => (
              <div key={i} className="game-panel" style={{ padding: 28 }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    border: `3px solid ${member.color}`,
                    boxShadow: `3px 3px 0 ${member.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    marginBottom: 16,
                    background: '#f0ece2',
                  }}
                >
                  {member.avatar}
                </div>
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    color: '#1c1917',
                    marginBottom: 6,
                    lineHeight: 1.6,
                  }}
                >
                  {member.name}
                </div>
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    color: member.color,
                    marginBottom: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {member.title}
                </div>
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    color: '#44403c',
                    lineHeight: 1.8,
                    marginBottom: 0,
                  }}
                >
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Vision ─── */}
      <section style={{ padding: '80px 0' }}>
        <div className="section-container" style={{ maxWidth: 800, textAlign: 'center' }}>
          <div className="section-label">🚀 OUR VISION</div>
          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(13px, 1.8vw, 20px)',
              color: '#1c1917',
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            WHERE WE&apos;RE GOING
          </h2>
          <div className="game-panel" style={{ padding: 40, marginBottom: 40, textAlign: 'left' }}>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 15,
                color: '#44403c',
                lineHeight: 1.9,
                marginBottom: 20,
              }}
            >
              We want Devception to become the place where developers come to practise coding with
              each other — not against a judge, not alone, but in a real team with real stakes.
            </p>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 15,
                color: '#44403c',
                lineHeight: 1.9,
                marginBottom: 20,
              }}
            >
              We want it to be used in universities, bootcamps, hackathons, and team-building events.
              We want the imposter mechanic to teach people to read code critically, communicate under
              pressure, and trust their instincts.
            </p>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 15,
                color: '#44403c',
                lineHeight: 1.9,
                fontStyle: 'italic',
                marginBottom: 0,
              }}
            >
              &ldquo;And honestly? We just want people to have fun.&rdquo;
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button onClick={() => triggerCinematic('/play')} className="pixel-btn pixel-btn-blue" style={{ fontSize: 10, textDecoration: 'none' }}>
              ▶ PLAY NOW
            </button>
            <a href="/blog" className="pixel-btn pixel-btn-light" style={{ fontSize: 10, textDecoration: 'none' }}>
              READ THE BLOG
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

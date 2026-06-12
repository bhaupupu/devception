import React, { useState, useEffect, useRef } from 'react';
import { useCinematic } from './CinematicProvider';

/* ─── Types ─── */
type Phase = 'intro' | 'joining' | 'role' | 'coding' | 'meeting' | 'result';

interface Bot {
  name: string;
  avatar: string;
  color: string;
  isUser?: boolean;
}

/* ─── Constants ─── */
const BOTS: Bot[] = [
  { name: 'YOU', avatar: '👤', color: '#2563eb', isUser: true },
  { name: 'alex_dev', avatar: '🧑‍💻', color: '#16a34a' },
  { name: 'sarah_c', avatar: '👩‍💻', color: '#7c3aed' },
  { name: 'mike_99', avatar: '🧑‍🔬', color: '#ca8a04' },
  { name: 'r00t_k1t', avatar: '🕵️', color: '#dc2626' },
];

const IMPOSTER_NAME = 'r00t_k1t';

const CODE_LINES = [
  '// Fix the broken search function',
  'function binarySearch(arr, target) {',
  '  let left = 0;',
  '  let right = arr.length - 1;',
  '  ',
  '  while (left <= right) {',
  '    const mid = Math.floor((left + right) / 2);',
  '    if (arr[mid] === target) return mid;',
  '    if (arr[mid] < target) left = mid + 1; // ← BUG HERE',
  '    else right = mid - 1;',
  '  }',
  '  return -1; // not found',
  '}',
];

const BOT_EDITS = [
  { player: 'alex_dev', line: 6, text: '    const mid = Math.floor((left + right) / 2);', delay: 2500 },
  { player: 'sarah_c', line: 7, text: '    if (arr[mid] === target) return mid;', delay: 4500 },
  { player: 'mike_99', line: 0, text: '// Collaborative fix in progress...', delay: 6000 },
  { player: 'r00t_k1t', line: 8, text: '    if (arr[mid] < target) left = mid - 1; // inserted bug', delay: 7500 },
];

const CHAT_MESSAGES = [
  { player: 'alex_dev', text: 'who just changed line 8??', delay: 500 },
  { player: 'sarah_c', text: 'yeah that looks wrong to me too', delay: 1800 },
  { player: 'r00t_k1t', text: 'i was just trying to help lol', delay: 3000 },
  { player: 'mike_99', text: 'r00t_k1t that clearly broke the binary search', delay: 4200 },
  { player: 'YOU', text: 'voting r00t_k1t. the edit makes no sense', delay: 5800 },
  { player: 'alex_dev', text: '+1 voting r00t_k1t', delay: 6500 },
];

/* ─── Sub-components ─── */
function PlayerChip({ bot, compact }: { bot: Bot; compact?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 6 : 8,
        padding: compact ? '4px 8px' : '8px 12px',
        background: bot.isUser ? 'rgba(37,99,235,0.08)' : '#faf8f4',
        border: `2px solid ${bot.color}`,
        boxShadow: `2px 2px 0 ${bot.color}55`,
      }}
    >
      <span style={{ fontSize: compact ? 14 : 18 }}>{bot.avatar}</span>
      <span
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: compact ? 6 : 8,
          color: bot.color,
        }}
      >
        {bot.name}
      </span>
      {bot.isUser && (
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 6,
            color: '#2563eb',
            border: '1px solid #2563eb',
            padding: '1px 4px',
          }}
        >
          YOU
        </span>
      )}
    </div>
  );
}

/* ─── Phase: Joining ─── */
function JoiningPhase({ onNext }: { onNext: () => void }) {
  const [joined, setJoined] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOTS.forEach((_, i) => {
      timers.push(setTimeout(() => setJoined(i + 1), i * 600 + 300));
    });
    timers.push(setTimeout(() => setReady(true), BOTS.length * 600 + 800));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div>
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          color: '#2563eb',
          marginBottom: 16,
          letterSpacing: '0.15em',
        }}
      >
        ROOM: DEMO-7734 | WAITING FOR PLAYERS...
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {BOTS.slice(0, joined).map((bot) => (
          <div
            key={bot.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            <PlayerChip bot={bot} />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 7,
                color: '#16a34a',
              }}
            >
              ✓ JOINED
            </span>
          </div>
        ))}
      </div>
      {ready && (
        <button
          onClick={onNext}
          className="pixel-btn pixel-btn-green"
          style={{ fontSize: 9 }}
        >
          ▶ START MATCH →
        </button>
      )}
    </div>
  );
}

/* ─── Phase: Role Reveal ─── */
function RolePhase({ onNext }: { onNext: () => void }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFlipped(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          color: '#44403c',
          marginBottom: 24,
          letterSpacing: '0.1em',
        }}
      >
        YOUR SECRET ROLE:
      </div>

      <div
        style={{
          perspective: 600,
          display: 'inline-block',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 280,
            height: 160,
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s ease',
            transform: flipped ? 'rotateY(0deg)' : 'rotateY(90deg)',
          }}
        >
          {/* Front */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#faf8f4',
              border: '3px solid #2563eb',
              boxShadow: '4px 4px 0 #2563eb',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              backfaceVisibility: 'hidden',
            }}
          >
            <div style={{ fontSize: 36 }}>👩‍💻</div>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 12,
                color: '#2563eb',
              }}
            >
              DEVELOPER
            </div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: '#44403c',
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              Collaborate. Fix the code.
              <br />
              Find the imposter.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
          color: '#44403c',
          marginBottom: 20,
          lineHeight: 1.7,
        }}
      >
        You are a <strong style={{ color: '#2563eb' }}>Good Coder</strong>. Work with your team
        to fix the code while identifying the hidden imposter.
      </div>

      <button onClick={onNext} className="pixel-btn pixel-btn-blue" style={{ fontSize: 9 }}>
        BEGIN CODING PHASE →
      </button>
    </div>
  );
}

/* ─── Phase: Coding ─── */
function CodingPhase({ onNext }: { onNext: () => void }) {
  const [lines, setLines] = useState<string[]>(CODE_LINES.slice(0, 3));
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [editCount, setEditCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [progress, setProgress] = useState(35);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOT_EDITS.forEach((edit) => {
      timers.push(
        setTimeout(() => {
          setActivePlayer(edit.player);
          setLines((prev) => {
            const next = [...prev];
            if (edit.line < next.length) next[edit.line] = edit.text;
            else next.push(edit.text);
            return next;
          });
          setEditCount((c) => c + 1);
          setProgress((p) => Math.min(p + 8, 65));
          if (edit.player === IMPOSTER_NAME) setShowAlert(true);
          setTimeout(() => setActivePlayer(null), 800);
        }, edit.delay)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div>
      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: '#44403c',
            }}
          >
            TEAM PROGRESS
          </span>
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: '#2563eb',
            }}
          >
            {progress}%
          </span>
        </div>
        <div
          style={{
            height: 10,
            background: '#e4dfd3',
            border: '2px solid #1c1917',
            boxShadow: 'inset 1px 1px 0 #d6d0c4',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: '#16a34a',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Imposter alert */}
      {showAlert && (
        <div
          style={{
            background: 'rgba(220,38,38,0.08)',
            border: '2px solid #dc2626',
            padding: '8px 12px',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: '#dc2626',
            }}
          >
            ⚠ SUSPICIOUS EDIT DETECTED — line 8 modified by r00t_k1t
          </span>
        </div>
      )}

      {/* Code editor */}
      <div
        style={{
          background: '#1e1e1e',
          border: '2px solid #1c1917',
          boxShadow: '3px 3px 0 #1c1917',
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          lineHeight: 1.8,
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            background: '#2d2d2d',
            padding: '4px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderBottom: '1px solid #444',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c940' }} />
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: '#888',
              marginLeft: 8,
            }}
          >
            challenge.js
          </span>
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: '#dc2626',
            }}
          >
            ● LIVE — {editCount} edits
          </span>
        </div>
        <div style={{ display: 'flex', maxHeight: 180, overflow: 'auto' }}>
          <div
            style={{
              padding: '8px 10px',
              color: '#555',
              textAlign: 'right',
              minWidth: 28,
              borderRight: '1px solid #333',
              userSelect: 'none',
            }}
          >
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <div style={{ padding: '8px 14px', color: '#d4d4d4', flex: 1 }}>
            {lines.map((line, i) => (
              <div
                key={i}
                style={{
                  color:
                    i === 8 && editCount >= 3 ? '#dc2626' : '#d4d4d4',
                  background: i === 8 && editCount >= 3 ? 'rgba(220,38,38,0.1)' : 'transparent',
                }}
              >
                {line || '\u00a0'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active players */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {BOTS.map((bot) => (
          <div
            key={bot.name}
            style={{
              opacity: activePlayer === bot.name ? 1 : 0.5,
              transition: 'opacity 0.3s',
              transform: activePlayer === bot.name ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <PlayerChip bot={bot} compact />
          </div>
        ))}
      </div>

      <button onClick={onNext} className="pixel-btn pixel-btn-red" style={{ fontSize: 9 }}>
        🚨 CALL EMERGENCY MEETING →
      </button>
    </div>
  );
}

/* ─── Phase: Meeting ─── */
function MeetingPhase({ onNext }: { onNext: () => void }) {
  const [messages, setMessages] = useState<typeof CHAT_MESSAGES>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState(false);
  const [phase, setPhase] = useState<'chat' | 'vote'>('chat');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    CHAT_MESSAGES.forEach((msg) => {
      timers.push(
        setTimeout(() => {
          setMessages((prev) => [...prev, msg]);
        }, msg.delay)
      );
    });
    timers.push(setTimeout(() => setPhase('vote'), 7500));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  function castVote(name: string) {
    if (voted) return;
    setVoted(true);
    const botVotes: Record<string, number> = { 'r00t_k1t': 3, alex_dev: 0, sarah_c: 0, mike_99: 0 };
    botVotes[name] = (botVotes[name] || 0) + 1;
    setVotes(botVotes);
    setTimeout(onNext, 1800);
  }

  return (
    <div>
      <div
        style={{
          background: 'rgba(220,38,38,0.06)',
          border: '2px solid #dc2626',
          padding: '8px 14px',
          marginBottom: 16,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          color: '#dc2626',
          letterSpacing: '0.1em',
        }}
      >
        🚨 EMERGENCY MEETING — DISCUSS &amp; VOTE
      </div>

      {/* Chat */}
      <div
        ref={chatRef}
        style={{
          background: '#faf8f4',
          border: '2px solid #1c1917',
          padding: 12,
          height: 180,
          overflowY: 'auto',
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {messages.map((msg, i) => {
          const bot = BOTS.find((b) => b.name === msg.player);
          return (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: bot?.color || '#1c1917',
                  flexShrink: 0,
                  paddingTop: 2,
                }}
              >
                {msg.player}:
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  color: '#1c1917',
                  lineHeight: 1.5,
                }}
              >
                {msg.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Vote */}
      {phase === 'vote' && (
        <div>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: '#1c1917',
              marginBottom: 12,
            }}
          >
            {voted ? 'VOTES CAST:' : 'VOTE TO ELIMINATE:'}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BOTS.filter((b) => !b.isUser).map((bot) => (
              <button
                key={bot.name}
                onClick={() => castVote(bot.name)}
                disabled={voted}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  padding: '8px 14px',
                  background: voted ? (bot.name === 'r00t_k1t' ? '#dc2626' : '#faf8f4') : '#faf8f4',
                  color: voted && bot.name === 'r00t_k1t' ? '#fff' : '#1c1917',
                  border: `2px solid ${bot.color}`,
                  boxShadow: `2px 2px 0 ${bot.color}`,
                  cursor: voted ? 'default' : 'pointer',
                }}
              >
                {bot.name}
                {voted && votes[bot.name] ? ` (${votes[bot.name]})` : ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Phase: Result ─── */
function ResultPhase({ onReset }: { onReset: () => void }) {
  const [reveal, setReveal] = useState(false);
  const { triggerCinematic } = useCinematic();

  useEffect(() => {
    const t = setTimeout(() => setReveal(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      {reveal && (
        <>
          <div
            style={{
              fontSize: 48,
              marginBottom: 16,
            }}
          >
            🏆
          </div>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 16,
              color: '#16a34a',
              marginBottom: 12,
              lineHeight: 1.6,
            }}
          >
            DEVELOPERS WIN!
          </div>
          <div
            style={{
              background: 'rgba(220,38,38,0.08)',
              border: '2px solid #dc2626',
              padding: '12px 20px',
              marginBottom: 20,
              display: 'inline-block',
            }}
          >
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: '#dc2626',
                marginBottom: 8,
              }}
            >
              ☠ IMPOSTER REVEALED
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 24 }}>🕵️</span>
              <div>
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    color: '#dc2626',
                  }}
                >
                  r00t_k1t
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    color: '#44403c',
                    marginTop: 4,
                  }}
                >
                  was the imposter all along
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: '#44403c',
              lineHeight: 1.8,
              marginBottom: 24,
            }}
          >
            You spotted the suspicious edit on line 8.<br />
            The team voted correctly. Mission complete.
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onReset} className="pixel-btn pixel-btn-light" style={{ fontSize: 8 }}>
              ↺ PLAY DEMO AGAIN
            </button>
            <button onClick={() => triggerCinematic('/play')} className="pixel-btn pixel-btn-blue" style={{ fontSize: 8 }}>
              ▶ PLAY NOW
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── PHASE CONFIG ─── */
const PHASE_ORDER: Phase[] = ['intro', 'joining', 'role', 'coding', 'meeting', 'result'];

const PHASE_LABELS: Record<Phase, string> = {
  intro: 'INTRO',
  joining: '01 — JOIN',
  role: '02 — ROLE',
  coding: '03 — CODE',
  meeting: '04 — VOTE',
  result: '05 — RESULT',
};

/* ─── MAIN COMPONENT ─── */
export default function LiveDemoSection() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [started, setStarted] = useState(false);

  function nextPhase() {
    const idx = PHASE_ORDER.indexOf(phase);
    if (idx < PHASE_ORDER.length - 1) setPhase(PHASE_ORDER[idx + 1]);
  }

  function reset() {
    setPhase('intro');
    setStarted(false);
  }

  const currentIndex = PHASE_ORDER.indexOf(phase);

  return (
    <section
      id="live-demo"
      style={{
        padding: '100px 0',
        background: 'rgba(37,99,235,0.03)',
        borderTop: '2px solid rgba(37,99,235,0.15)',
        borderBottom: '2px solid rgba(37,99,235,0.15)',
      }}
    >
      <div className="section-container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label">▶ INTERACTIVE DEMO</div>
          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(14px, 2.2vw, 24px)',
              color: '#1c1917',
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            EXPERIENCE A MATCH
          </h2>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              color: '#44403c',
              maxWidth: 560,
              margin: '0 auto',
              lineHeight: 1.8,
            }}
          >
            Play through a guided demo match against bots. No account needed. Takes about 2 minutes.
          </p>
        </div>

        {/* Demo container */}
        <div
          style={{
            maxWidth: 700,
            margin: '0 auto',
          }}
        >
          {/* Phase progress bar */}
          {started && (
            <div
              style={{
                display: 'flex',
                marginBottom: 24,
                border: '2px solid #1c1917',
                overflow: 'hidden',
              }}
            >
              {PHASE_ORDER.filter((p) => p !== 'intro').map((p, i) => (
                <div
                  key={p}
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    background:
                      currentIndex > i + 1
                        ? '#2563eb'
                        : currentIndex === i + 1
                        ? '#1c1917'
                        : '#faf8f4',
                    borderRight: i < 4 ? '1px solid #1c1917' : 'none',
                    textAlign: 'center',
                    transition: 'background 0.3s',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 6,
                      color:
                        currentIndex > i + 1
                          ? '#fff'
                          : currentIndex === i + 1
                          ? '#fff'
                          : '#78716c',
                    }}
                  >
                    {PHASE_LABELS[p]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Panel */}
          <div
            className="game-panel"
            style={{ padding: 32, minHeight: 300, position: 'relative' }}
          >
            {/* Intro */}
            {phase === 'intro' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 12,
                    color: '#1c1917',
                    marginBottom: 16,
                    lineHeight: 1.8,
                  }}
                >
                  DEMO MATCH
                </div>
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    color: '#44403c',
                    lineHeight: 1.8,
                    marginBottom: 8,
                  }}
                >
                  You&apos;ll join a room, get a role, collaborate on code,<br />
                  spot the imposter, vote, and see the result.
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28, justifyContent: 'center' }}>
                  {['2 MIN', '5 PLAYERS', '1 IMPOSTER', 'JAVASCRIPT'].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 7,
                        padding: '4px 10px',
                        border: '2px solid #2563eb',
                        color: '#2563eb',
                        background: 'rgba(37,99,235,0.06)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => { setStarted(true); nextPhase(); }}
                  className="pixel-btn pixel-btn-blue"
                  style={{ fontSize: 10 }}
                >
                  ▶ START DEMO
                </button>
              </div>
            )}

            {phase === 'joining' && <JoiningPhase onNext={nextPhase} />}
            {phase === 'role' && <RolePhase onNext={nextPhase} />}
            {phase === 'coding' && <CodingPhase onNext={nextPhase} />}
            {phase === 'meeting' && <MeetingPhase onNext={nextPhase} />}
            {phase === 'result' && <ResultPhase onReset={reset} />}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

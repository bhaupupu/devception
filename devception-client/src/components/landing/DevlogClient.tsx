'use client';

import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';

// Honest build log for a pre-launch project. No invented metrics, users, or
// shipped-but-not-real features — every entry maps to real commits in the repo
// (dates match git history; v0.1.0 is the pre-repo weekend prototype).
const DEVLOG_ENTRIES = [
  {
    version: 'v0.3.4',
    date: '2026-06-29',
    title: 'Editor stability: Yjs desync fixed + anti-grief guardrails',
    content: 'Squashed the nastiest sync bug so far: undo operations could desync the shared document when they raced against remote updates. The fix defers undo until pending remote updates apply, and keeps remote edits out of your local undo stack. Also added a guardrail against low-effort griefing — normal typing is untouched, but sweeping multi-line deletes and copies are blocked in the shared editor.',
  },
  {
    version: 'v0.3.3',
    date: '2026-06-23',
    title: 'Server-side socket protection + demo account seeder',
    content: 'Hardened the real-time layer: privileged socket events are now validated server-side instead of trusting the client, and the login flow got a round of fixes. Also built a seeder for demo accounts so playtest lobbies can be spun up quickly without everyone needing to sign in with Google.',
  },
  {
    version: 'v0.3.2',
    date: '2026-06-21',
    title: 'Content and SEO overhaul',
    content: 'Rewrote the About page, replaced a set of generic blog drafts with fewer, longer, cited articles under a real byline, moved to a static sitemap with accurate lastmod dates, and cleaned up structured data. Less content, but all of it real — that trade was deliberate.',
  },
  {
    version: 'v0.3.1',
    date: '2026-06-13',
    title: 'Cinematic landing experience',
    content: 'The landing page became a game screen: illustrated pixel-art hero with parallax scrolling, a loading-console transition when you hit Play, and scroll-triggered animations throughout. Took several iterations of background sizing and stacking-context bugs to get the scene rendering right across viewports.',
  },
  {
    version: 'v0.3.0',
    date: '2026-06-10',
    title: 'Conflict-free shared editor (Yjs CRDTs)',
    content: 'Replaced the early "last write wins" sync with Yjs, a CRDT library, wired into the Monaco editor. Multiple people can now type on the same line without overwriting each other or fighting the cursor. This was the single hardest problem in the project and the change that finally made collaborative coding feel real.',
  },
  {
    version: 'v0.2.3',
    date: '2026-05-08',
    title: 'Imposter balancing pass',
    content: 'Tuned the social-deduction layer end to end: how much power sabotage should have, cooldown lengths, and the emergency-meeting flow with anonymous voting. Sabotage is intentionally subtle — the goal is plausible deniability, not screen-wrecking. Still actively balancing how strong an imposter should be.',
  },
  {
    version: 'v0.2.2',
    date: '2026-04-18',
    title: 'Playtest hardening',
    content: 'A batch of fixes straight from playtest sessions: per-user undo so you cannot revert a teammate’s work, test-case validation for mini tasks, protected code regions, proper disconnect handling, spectator mode for eliminated players, and a Python sandbox for the Run Code feature.',
  },
  {
    version: 'v0.2.1',
    date: '2026-04-09',
    title: 'Test cases for the main problem',
    content: 'The shared codebase now has real test cases, so "is the code fixed?" is decided by tests instead of vibes. Also fixed Monaco editor quirks, made the imposter cooldown shared across abilities, and improved game-end detection.',
  },
  {
    version: 'v0.2.0',
    date: '2026-04-07',
    title: 'CodeCrew becomes Devception',
    content: 'Renamed the project to Devception and shipped a big gameplay batch: unique per-player mini tasks with a task modal, the imposter’s fake-complete ability, expanded starter-code templates, and a proper game-over screen.',
  },
  {
    version: 'v0.1.1',
    date: '2026-04-04',
    title: 'Monorepo + first real deploys',
    content: 'Moved into a proper monorepo: Next.js client on Vercel, Socket.IO server on Railway, MongoDB Atlas for persistence. Added email/password auth for playtesting, configurable discussion and voting timers, and early vote-end when everyone has voted.',
  },
  {
    version: 'v0.1.0',
    date: '2026-03-22',
    title: 'First playable build',
    content: 'The first end-to-end loop, built as a weekend prototype before this repo existed: a lobby, random role assignment, a shared code editor, and real-time state over Socket.IO. Rough around the edges, but enough to play a full match start to finish. This devlog is where the real changes get written down.',
  },
];

export default function DevlogClient() {
  return (
    <div style={{ background: '#faf8f4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: '120px 24px 80px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 60, borderBottom: '3px solid #1c1917', paddingBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Link href="/" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: '#78716c', textDecoration: 'none' }}>HOME</Link>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: '#a8a29e' }}>/</span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: '#2563eb' }}>DEVLOG</span>
          </div>
          <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(20px, 3vw, 32px)', color: '#1c1917', marginBottom: 16 }}>
            SYSTEM LOGS
          </h1>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, color: '#44403c', lineHeight: 1.6 }}>
            Patch notes, feature updates, and developer logs. Stay informed about the latest changes to the Devception platform.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {DEVLOG_ENTRIES.map((entry, idx) => (
            <article 
              key={idx}
              style={{
                background: '#fff',
                border: '2px solid #1c1917',
                boxShadow: '4px 4px 0 rgba(28,25,23,0.1)',
                padding: 32,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: '#1c1917', marginBottom: 8, lineHeight: 1.5 }}>
                    {entry.title}
                  </h2>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#2563eb', border: '1px solid #2563eb', padding: '4px 8px' }}>
                    {entry.version}
                  </span>
                </div>
                <time style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: '#78716c' }}>
                  {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#292524', lineHeight: 1.8 }}>
                {entry.content}
              </p>
            </article>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

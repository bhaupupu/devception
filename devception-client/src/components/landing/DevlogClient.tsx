'use client';

import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';

// Honest build log for a pre-launch project. No invented metrics, users, or
// shipped-but-not-real features — these are the actual development milestones.
const DEVLOG_ENTRIES = [
  {
    version: 'v0.3.0',
    date: '2026-06-10',
    title: 'Conflict-free shared editor (Yjs CRDTs)',
    content: 'Replaced the early "last write wins" sync with Yjs, a CRDT library, wired into the Monaco editor. Multiple people can now type on the same line without overwriting each other or fighting the cursor. This was the single hardest problem in the project and the change that finally made collaborative coding feel real.',
  },
  {
    version: 'v0.2.0',
    date: '2026-05-08',
    title: 'Imposter mechanics + emergency meetings',
    content: 'Added the social-deduction layer: hidden imposter roles, subtle sabotage actions, the emergency-meeting flow, and anonymous voting. Sabotage is intentionally subtle — the goal is plausible deniability, not screen-wrecking. Still actively balancing how much power an imposter should have.',
  },
  {
    version: 'v0.1.0',
    date: '2026-03-22',
    title: 'First playable build',
    content: 'The first end-to-end loop: a lobby, random role assignment, a shared code editor, and real-time state over Socket.IO. Rough around the edges, but enough to play a full match start to finish. Devception is in active development and pre-launch — this devlog is where the real changes get written down.',
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

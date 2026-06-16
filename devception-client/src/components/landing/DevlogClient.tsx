'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';

const DEVLOG_ENTRIES = [
  {
    version: 'v1.1.0',
    date: '2025-06-15',
    title: 'The Great Optimization Update',
    content: 'We\'ve completely rewritten our code synchronization engine using CRDTs. You should notice a massive reduction in latency and zero cursor conflicts when multiple people are typing on the same line. We also added syntax highlighting support for Python.',
  },
  {
    version: 'v1.0.5',
    date: '2025-05-22',
    title: 'New Sabotage Mechanics',
    content: 'Imposters felt a bit underpowered in the late game, so we added two new abilities: "Variable Scrambler" (temporarily renames local variables on a victim\'s screen) and "Silent Syntax Error" (inserts a missing semicolon that only compiles locally for 30 seconds).',
  },
  {
    version: 'v1.0.0',
    date: '2025-05-01',
    title: 'Welcome to Devception 1.0',
    content: 'After 6 months of beta testing, Devception is officially live! Huge thanks to the 5,000+ developers who helped us refine the core loop. This release includes the ELO ranking system, private lobbies, and the highly requested dark mode terminal theme.',
  },
];

export default function DevlogClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

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

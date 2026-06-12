'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'HOW IT WORKS', href: '#how-it-works' },
  { label: 'BLOG', href: '/blog' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-login-btn { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>

      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#faf8f4',
          borderBottom: '3px solid #1c1917',
          boxShadow: scrolled ? '2px 2px 0 #1c1917' : 'none',
          transition: 'box-shadow 0.2s',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
          }}
        >
          {/* LOGO */}
          <Link
            href="/"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 13,
              color: '#1c1917',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ color: '#2563eb' }}>&gt;</span>
            DEVCEPTION
          </Link>

          {/* CENTER LINKS (desktop) */}
          <div
            className="nav-links-desktop"
            style={{
              display: 'flex',
              gap: 32,
              alignItems: 'center',
            }}
          >
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  color: '#44403c',
                  textDecoration: 'none',
                  letterSpacing: '0.1em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = '#44403c';
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* RIGHT BUTTONS */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link
              href="/login"
              className="nav-login-btn"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: '#1c1917',
                textDecoration: 'none',
                padding: '8px 16px',
                border: '2px solid #1c1917',
                transition: 'all 0.15s',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '2px 2px 0 #1c1917',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#1c1917';
                el.style.color = '#faf8f4';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.color = '#1c1917';
              }}
            >
              LOGIN
            </Link>

            <Link
              href="/play"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                padding: '8px 18px',
                background: '#2563eb',
                color: '#fff',
                border: '2px solid #1c1917',
                boxShadow: '3px 3px 0 #1c1917',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'transform 0.08s, box-shadow 0.08s',
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
              ▶ PLAY NOW
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hamburger-btn"
              style={{
                display: 'none',
                background: '#faf8f4',
                border: '2px solid #1c1917',
                color: '#1c1917',
                padding: '6px 10px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: 16,
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 2px 0 #1c1917',
              }}
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div
            style={{
              background: '#faf8f4',
              borderTop: '2px solid rgba(28,25,23,0.15)',
              padding: '16px 24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 9,
                  color: '#1c1917',
                  textDecoration: 'none',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(28,25,23,0.12)',
                  display: 'block',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = '#1c1917';
                }}
              >
                &gt; {l.label}
              </a>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  color: '#1c1917',
                  textDecoration: 'none',
                  padding: '10px 16px',
                  border: '2px solid #1c1917',
                  boxShadow: '2px 2px 0 #1c1917',
                }}
              >
                LOGIN
              </Link>
              <Link
                href="/play"
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '10px 16px',
                  background: '#2563eb',
                  border: '2px solid #1c1917',
                  boxShadow: '2px 2px 0 #1c1917',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                ▶ PLAY NOW
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

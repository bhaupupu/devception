'use client';
import React from 'react';
import Link from 'next/link';
import { useCinematic } from './CinematicProvider';

const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  PRODUCT: [
    { label: 'About', href: '/about' },
    { label: 'How To Play', href: '#how-it-works' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  LEGAL: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
  ],
  PLAY: [
    { label: 'PLAY NOW', href: '/play' },
    { label: 'Login', href: '/login' },
  ],
};

export default function Footer() {
  const { triggerCinematic } = useCinematic();

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-bottom { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <footer
        style={{
          background: '#1c1917',
          borderTop: '3px solid #2563eb',
          padding: '60px 0 32px',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          {/* Top grid */}
          <div
            className="footer-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: 48,
              marginBottom: 48,
              paddingBottom: 48,
              borderBottom: '1px solid rgba(229,224,213,0.1)',
            }}
          >
            {/* Brand column */}
            <div>
              <Link
                href="/"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 15,
                  color: '#e5e0d5',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <span style={{ color: '#2563eb' }}>&gt;</span>
                DEVCEPTION
              </Link>

              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  color: '#78716c',
                  lineHeight: 2,
                  marginBottom: 24,
                  maxWidth: 280,
                }}
              >
                Multiplayer social deduction coding game. Code together. Find the imposter. Trust no one.
              </p>

              {/* Social buttons */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: 'DISCORD', color: '#7c3aed', href: '#' },
                  { label: 'GITHUB', color: '#e5e0d5', href: '#' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 7,
                      color: social.color,
                      border: `2px solid ${social.color}`,
                      padding: '6px 12px',
                      textDecoration: 'none',
                      boxShadow: `2px 2px 0 ${social.color}60`,
                      transition: 'opacity 0.2s',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '0.75';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '1';
                    }}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section}>
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 8,
                    color: '#2563eb',
                    marginBottom: 20,
                    letterSpacing: '0.15em',
                  }}
                >
                  {section}
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
                  {links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith('/play') || link.href.startsWith('/login') ? (
                        <button
                          onClick={() => triggerCinematic(link.href)}
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 12,
                            color: '#78716c',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = '#e5e0d5';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = '#78716c';
                          }}
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          href={link.href}
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 12,
                            color: '#78716c',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                            display: 'block',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = '#e5e0d5';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = '#78716c';
                          }}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div
            className="footer-bottom"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 7,
                color: '#44403c',
                letterSpacing: '0.06em',
              }}
            >
              © 2025 DEVCEPTION. ALL RIGHTS RESERVED.
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: '#44403c',
                }}
              >
                v1.0.0-beta
              </span>
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: '#16a34a',
                  border: '2px solid #16a34a',
                  padding: '4px 10px',
                  boxShadow: '2px 2px 0 #16a34a40',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                ■ ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

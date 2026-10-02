'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useCinematic } from './CinematicProvider';

const navLinks = [
  { label: 'HOW IT WORKS', href: '/#how-it-works' },
  { label: 'DEMO', href: '/#live-demo' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'BLOG', href: '/blog' },
  { label: 'DEVLOG', href: '/devlog' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { triggerCinematic } = useCinematic();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated' && !!session?.user;
  const user = session?.user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    triggerCinematic('/login?callbackUrl=/lobby');
  };

  const handlePlayNow = () => {
    triggerCinematic('/lobby');
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-login-btn { display: none !important; }
          .nav-user-desktop-name { display: none !important; }
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
            {isLoggedIn ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="nav-user-btn"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 8,
                    color: '#1c1917',
                    background: '#faf8f4',
                    border: '2px solid #1c1917',
                    boxShadow: userDropdownOpen ? '1px 1px 0 #1c1917' : '2px 2px 0 #1c1917',
                    transform: userDropdownOpen ? 'translate(1px, 1px)' : 'none',
                    padding: '5px 10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  title={`Logged in as ${user?.name || 'Player'}`}
                  aria-label="User profile menu"
                >
                  {/* Avatar / User icon */}
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'User'}
                      style={{
                        width: 22,
                        height: 22,
                        border: '1.5px solid #1c1917',
                        background: '#dbeafe',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        border: '1.5px solid #1c1917',
                        background: '#dbeafe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                      }}
                    >
                      👾
                    </div>
                  )}

                  {/* Pulsing online indicator */}
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#22c55e',
                      boxShadow: '0 0 6px #22c55e',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />

                  {/* User name on desktop */}
                  <span
                    className="nav-user-desktop-name"
                    style={{
                      maxWidth: 90,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.name || 'AGENT'}
                  </span>

                  <span style={{ fontSize: 7, color: '#78716c' }}>▼</span>
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: '#faf8f4',
                      border: '2px solid #1c1917',
                      boxShadow: '4px 4px 0 #1c1917',
                      minWidth: 210,
                      zIndex: 1100,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* User Header */}
                    <div
                      style={{
                        padding: '12px',
                        borderBottom: '2px solid #1c1917',
                        background: '#f5f0e6',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#22c55e',
                            display: 'inline-block',
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: 7,
                            color: '#15803d',
                          }}
                        >
                          LOGGED IN
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 9,
                          color: '#1c1917',
                          wordBreak: 'break-all',
                        }}
                      >
                        {user?.name || 'PLAYER'}
                      </div>
                      {user?.email && (
                        <div
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 10,
                            color: '#78716c',
                            wordBreak: 'break-all',
                            marginTop: 2,
                          }}
                        >
                          {user.email}
                        </div>
                      )}
                    </div>

                    {/* Menu Actions */}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        triggerCinematic('/lobby');
                      }}
                      style={{
                        padding: '10px 12px',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 8,
                        color: '#1c1917',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(28,25,23,0.12)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#e0e7ff'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <span>🎮</span> GAME DASHBOARD
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        router.push('/profile');
                      }}
                      style={{
                        padding: '10px 12px',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 8,
                        color: '#1c1917',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(28,25,23,0.12)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#e0e7ff'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <span>👤</span> PROFILE
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      style={{
                        padding: '10px 12px',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 8,
                        color: '#dc2626',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#fee2e2'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      <span>🚪</span> LOGOUT
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
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
                  background: 'transparent',
                  cursor: 'pointer',
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
              </button>
            )}

            <button
              onClick={handlePlayNow}
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
                cursor: 'pointer',
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
            </button>

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

            {isLoggedIn ? (
              <div
                style={{
                  marginTop: 16,
                  padding: '14px',
                  border: '2px solid #1c1917',
                  background: '#f5f0e6',
                  boxShadow: '2px 2px 0 #1c1917',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'User'}
                      style={{ width: 32, height: 32, border: '2px solid #1c1917', background: '#dbeafe' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        border: '2px solid #1c1917',
                        background: '#dbeafe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                      }}
                    >
                      👾
                    </div>
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#22c55e',
                          boxShadow: '0 0 5px #22c55e',
                          display: 'inline-block',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 7,
                          color: '#15803d',
                        }}
                      >
                        LOGGED IN
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 9,
                        color: '#1c1917',
                        marginTop: 4,
                      }}
                    >
                      {user?.name || 'PLAYER'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      triggerCinematic('/lobby');
                    }}
                    className="pixel-btn pixel-btn-blue"
                    style={{ fontSize: 8, flex: '1 1 100%', padding: '10px 14px' }}
                  >
                    ▶ PLAY NOW (DASHBOARD)
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push('/profile');
                    }}
                    className="pixel-btn pixel-btn-light"
                    style={{ fontSize: 8, flex: '1 1 45%', padding: '8px 10px' }}
                  >
                    PROFILE
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="pixel-btn pixel-btn-light"
                    style={{ fontSize: 8, flex: '1 1 45%', color: '#dc2626', borderColor: '#dc2626', padding: '8px 10px' }}
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogin();
                  }}
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 8,
                    color: '#1c1917',
                    textDecoration: 'none',
                    padding: '10px 16px',
                    border: '2px solid #1c1917',
                    boxShadow: '2px 2px 0 #1c1917',
                    background: '#faf8f4',
                  }}
                >
                  LOGIN
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handlePlayNow();
                  }}
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
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

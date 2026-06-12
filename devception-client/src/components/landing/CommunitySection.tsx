'use client';
import React, { useState } from 'react';

const COMMUNITY_LINKS = [
  {
    icon: '💬',
    title: 'DISCORD',
    desc: 'Join 2,000+ developers in our community server. Find teammates, discuss matches, share strategies, and get the latest Devception news.',
    cta: 'JOIN DISCORD',
    color: '#7c3aed',
    href: '#',
  },
  {
    icon: '🐙',
    title: 'GITHUB',
    desc: 'Devception is open source. Contribute to the codebase, report bugs, suggest features, or fork the project and build your own variant.',
    cta: 'VIEW REPO',
    color: '#e0e0e0',
    href: '#',
  },
  {
    icon: '📋',
    title: 'ROADMAP',
    desc: 'See exactly what we\'re building and when. Community members can upvote features and directly influence the development priority queue.',
    cta: 'VIEW ROADMAP',
    color: '#2563eb',
    href: '#about',
  },
  {
    icon: '📰',
    title: 'NEWSLETTER',
    desc: 'Weekly dispatches from the Devception team: match statistics, feature previews, community highlights, and upcoming event announcements.',
    cta: 'SUBSCRIBE',
    color: '#16a34a',
    href: '#',
    isNewsletter: true,
  },
];

export default function CommunitySection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section
      id="community"
      style={{
        padding: '100px 0',
        borderTop: '1px solid rgba(37,99,235,0.2)',
        background: 'rgba(124,58,237,0.02)',
      }}
    >
      <div className="section-container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label">// NETWORK</div>
          <h2 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(14px, 2vw, 24px)',
            color: '#fff',
            lineHeight: 1.6,
          }}>
            JOIN THE COMMUNITY
          </h2>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            color: '#666',
            marginTop: 12,
            maxWidth: 600,
            margin: '12px auto 0',
          }}>
            The Devception community is where agents debrief, strategies are shared, and the next match begins. Find your team.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}>
          {COMMUNITY_LINKS.map((link) => (
            <div key={link.title}>
              {link.isNewsletter ? (
                <div
                  className="community-card"
                  style={{ border: `2px solid ${link.color}30`, height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{link.icon}</div>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 12,
                    color: link.color,
                    marginBottom: 12,
                  }}>
                    {link.title}
                  </div>
                  <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    color: '#a0a0a0',
                    lineHeight: 1.8,
                    marginBottom: 20,
                    flex: 1,
                    textAlign: 'left',
                  }}>
                    {link.desc}
                  </p>
                  {subscribed ? (
                    <div style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 8,
                      color: '#16a34a',
                      border: '1px solid #16a34a',
                      padding: '10px',
                    }}>
                      ✓ SUBSCRIBED
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 0 }}>
                      <input
                        type="email"
                        placeholder="agent@dev.io"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          flex: 1,
                          background: '#050508',
                          border: `2px solid ${link.color}40`,
                          borderRight: 'none',
                          padding: '10px 12px',
                          color: '#e0e0e0',
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 11,
                          outline: 'none',
                        }}
                      />
                      <button
                        onClick={() => { if (email) setSubscribed(true); }}
                        style={{
                          background: link.color,
                          border: 'none',
                          padding: '10px 14px',
                          cursor: 'pointer',
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: 8,
                          color: '#fff',
                        }}
                      >
                        GO
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href={link.href}
                  className="community-card"
                  style={{
                    border: `2px solid ${link.color}30`,
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{link.icon}</div>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 12,
                    color: link.color,
                    marginBottom: 12,
                  }}>
                    {link.title}
                  </div>
                  <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    color: '#a0a0a0',
                    lineHeight: 1.8,
                    marginBottom: 20,
                    flex: 1,
                    textAlign: 'left',
                  }}>
                    {link.desc}
                  </p>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 8,
                    color: link.color,
                    border: `1px solid ${link.color}`,
                    padding: '10px',
                    display: 'inline-block',
                  }}>
                    {link.cta} →
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Community stats */}
        <div style={{
          marginTop: 48,
          border: '1px solid rgba(37,99,235,0.2)',
          padding: 32,
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 24,
          background: '#0d1117',
        }}>
          {[
            { value: '2,000+', label: 'DISCORD MEMBERS' },
            { value: '450+', label: 'GITHUB STARS' },
            { value: '1,200+', label: 'NEWSLETTER SUBSCRIBERS' },
            { value: '15+', label: 'COUNTRIES ACTIVE' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 22,
                color: '#2563eb',
                marginBottom: 8,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 7,
                color: '#555',
                letterSpacing: '0.1em',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

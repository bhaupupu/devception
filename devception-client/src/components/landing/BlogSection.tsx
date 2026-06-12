'use client';
import React from 'react';
import Link from 'next/link';

const POSTS = [
  {
    slug: 'social-deduction-coding-collaboration',
    title: 'How Social Deduction Changes Coding Collaboration',
    excerpt: 'The neuroscience of suspicion, collaboration under pressure, and why the imposter mechanic changes everything about how we approach problem-solving.',
    date: '2025-01-15',
    readTime: '8 MIN READ',
    tag: 'GAME DESIGN',
    color: '#2563eb',
  },
  {
    slug: 'how-we-built-devception',
    title: 'How We Built Devception: A Student Developer\'s Journey',
    excerpt: 'From a Discord conversation to a full-stack multiplayer coding game: the messy, thrilling story behind Devception\'s creation.',
    date: '2025-01-10',
    readTime: '12 MIN READ',
    tag: 'BEHIND THE SCENES',
    color: '#16a34a',
  },
  {
    slug: 'psychology-finding-imposter',
    title: 'The Psychology of Finding the Imposter',
    excerpt: 'Behavioral patterns, micro-tells in code edits, and the cognitive biases that make social deduction games endlessly fascinating.',
    date: '2025-01-05',
    readTime: '10 MIN READ',
    tag: 'PSYCHOLOGY',
    color: '#dc2626',
  },
  {
    slug: 'games-improve-programming-skills',
    title: 'Can Games Actually Improve Your Programming Skills?',
    excerpt: 'New research suggests game-based coding platforms improve retention, problem-solving speed, and collaborative skills faster than traditional practice.',
    date: '2024-12-28',
    readTime: '7 MIN READ',
    tag: 'RESEARCH',
    color: '#ca8a04',
  },
  {
    slug: 'multiplayer-learning-works-better',
    title: 'Why Multiplayer Learning Beats Solo Study',
    excerpt: 'From pair programming to mob programming: the science behind why developers learn faster when they code together.',
    date: '2024-12-20',
    readTime: '9 MIN READ',
    tag: 'EDUCATION',
    color: '#7c3aed',
  },
];

export default function BlogSection() {
  return (
    <section
      id="blog"
      style={{
        padding: '100px 0',
        borderTop: '2px solid rgba(28,25,23,0.1)',
      }}
    >
      <div className="section-container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label">// INTEL DISPATCHES</div>
          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(14px, 2vw, 24px)',
              color: '#1c1917',
              lineHeight: 1.6,
            }}
          >
            BLOG &amp; ARTICLES
          </h2>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              color: '#44403c',
              marginTop: 12,
            }}
          >
            Field reports, research briefings, and developer dispatches from the Devception team.
          </p>
        </div>

        {/* Featured post */}
        <Link
          href={`/blog/${POSTS[0].slug}`}
          style={{
            textDecoration: 'none',
            display: 'block',
            marginBottom: 20,
          }}
        >
          <div
            className="blog-card"
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: 0,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: POSTS[0].color,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 32,
                gap: 12,
              }}
            >
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '0.2em',
                }}
              >
                FEATURED
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 28,
                  color: '#fff',
                }}
              >
                ★
              </div>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '4px 10px',
                  textAlign: 'center',
                }}
              >
                {POSTS[0].tag}
              </div>
            </div>
            <div style={{ padding: 32 }}>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: '#78716c',
                  marginBottom: 16,
                }}
              >
                {POSTS[0].date} · {POSTS[0].readTime}
              </div>
              <h3
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 13,
                  color: '#1c1917',
                  lineHeight: 1.7,
                  marginBottom: 16,
                }}
              >
                {POSTS[0].title}
              </h3>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 13,
                  color: '#44403c',
                  lineHeight: 1.8,
                  marginBottom: 24,
                }}
              >
                {POSTS[0].excerpt}
              </p>
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  color: POSTS[0].color,
                  border: `2px solid ${POSTS[0].color}`,
                  padding: '8px 16px',
                  display: 'inline-block',
                  boxShadow: `2px 2px 0 ${POSTS[0].color}`,
                }}
              >
                READ ARTICLE →
              </span>
            </div>
          </div>
        </Link>

        {/* Other posts grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
            marginBottom: 40,
          }}
        >
          {POSTS.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="blog-card" style={{ height: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 7,
                      color: post.color,
                      border: `2px solid ${post.color}`,
                      padding: '3px 8px',
                      background: `${post.color}0d`,
                    }}
                  >
                    {post.tag}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 7,
                      color: '#78716c',
                    }}
                  >
                    {post.readTime}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    color: '#1c1917',
                    lineHeight: 1.8,
                    marginBottom: 12,
                  }}
                >
                  {post.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    color: '#44403c',
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  {post.excerpt}
                </p>

                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    color: '#78716c',
                  }}
                >
                  {post.date}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/blog" className="pixel-btn pixel-btn-blue" style={{ fontSize: 9 }}>
            VIEW ALL ARTICLES →
          </Link>
        </div>
      </div>
    </section>
  );
}

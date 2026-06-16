'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { blogPosts } from '@/lib/blog-data';

// Map the blogPosts to the format needed for the landing page
const POSTS = blogPosts.slice(0, 10).map(post => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  date: new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  readTime: `${post.readTime} MIN READ`,
  tag: post.category.toUpperCase(),
  color: getCategoryColor(post.category),
}));

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    'Game Design': '#2563eb',
    'Developer Growth': '#16a34a',
    'Game Psychology': '#dc2626',
    'Developer Life': '#ca8a04',
    'Behind the Scenes': '#7c3aed',
    'Technical': '#0891b2',
    'Guides': '#059669',
  };
  return colors[category] || '#2563eb';
}

export default function BlogSection() {
  return (
    <section
      id="blog"
      style={{
        padding: '100px 0',
        borderTop: '2px solid rgba(28,25,23,0.1)',
      }}
    >
      <motion.div
        className="section-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
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
      </motion.div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogPost, blogPosts } from '@/lib/blog-data';
import { AUTHOR } from '@/lib/site';
import { useCinematic } from '@/components/landing/CinematicProvider';

const categoryColors: Record<string, string> = {
  'Game Design': '#2563eb',
  'Developer Growth': '#16a34a',
  'Game Psychology': '#9333ea',
  'Developer Life': '#d97706',
  'Behind the Scenes': '#dc2626',
  'Technical': '#0891b2',
  'Guides': '#059669',
};

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const [mounted, setMounted] = useState(false);
  const { triggerCinematic } = useCinematic();

  useEffect(() => {
    setMounted(true);
  }, []);

  const color = categoryColors[post.category] || '#2563eb';
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Related posts (same category, excluding current)
  const related = blogPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0ece2',
        backgroundImage:
          'linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        .blog-content h2 {
          font-family: 'Press Start 2P', monospace;
          font-size: 14px;
          color: #1c1917;
          line-height: 1.8;
          margin: 40px 0 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid rgba(28,25,23,0.12);
        }
        .blog-content h3 {
          font-family: 'Press Start 2P', monospace;
          font-size: 10px;
          color: #2563eb;
          line-height: 1.8;
          margin: 28px 0 12px;
        }
        .blog-content p {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #292524;
          line-height: 1.85;
          margin: 0 0 20px;
        }
        .blog-content ul {
          margin: 0 0 20px;
          padding-left: 24px;
        }
        .blog-content li {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #292524;
          line-height: 1.85;
          margin-bottom: 8px;
        }
        .blog-content li strong {
          color: #1c1917;
          font-weight: 700;
        }
        .blog-content code {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          background: #e4dfd3;
          border: 1px solid #c4bfb5;
          padding: 2px 6px;
          color: #1c1917;
        }
        .blog-content strong {
          color: #1c1917;
          font-weight: 700;
        }
      `}</style>

      {/* Breadcrumb nav */}
      <div
        style={{
          background: '#faf8f4',
          borderBottom: '3px solid #1c1917',
          padding: '80px 24px 20px',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '8px',
                color: '#78716c',
                textDecoration: 'none',
              }}
            >
              HOME
            </Link>
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '8px',
                color: '#a8a29e',
              }}
            >
              /
            </span>
            <Link
              href="/blog"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '8px',
                color: '#78716c',
                textDecoration: 'none',
              }}
            >
              BLOG
            </Link>
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '8px',
                color: '#a8a29e',
              }}
            >
              /
            </span>
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '8px',
                color: '#2563eb',
              }}
            >
              {post.category.toUpperCase()}
            </span>
          </div>

          {/* Category badge */}
          <div style={{ marginBottom: '20px' }}>
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '8px',
                color,
                border: `2px solid ${color}`,
                padding: '4px 10px',
                display: 'inline-block',
              }}
            >
              {post.category.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(14px, 2.5vw, 22px)',
              color: '#1c1917',
              lineHeight: '1.8',
              margin: '0 0 24px 0',
            }}
          >
            {post.title}
          </h1>

          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '2px solid rgba(28,25,23,0.12)',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                color: '#78716c',
              }}
            >
              {formattedDate}
            </span>
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '8px',
                color: '#2563eb',
              }}
            >
              {post.readTime} MIN READ
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                color: '#78716c',
              }}
            >
              By {post.author}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Article body */}
        <article
          style={{
            background: '#faf8f4',
            border: '3px solid #1c1917',
            boxShadow: '4px 4px 0 #1c1917',
            padding: 'clamp(24px, 5vw, 56px)',
            marginBottom: '48px',
          }}
        >
          {/* Excerpt */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '18px',
              color: '#44403c',
              lineHeight: '1.8',
              fontStyle: 'italic',
              borderLeft: `4px solid ${color}`,
              paddingLeft: '20px',
              margin: '0 0 32px 0',
            }}
          >
            {post.excerpt}
          </p>

          {/* Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div
            style={{
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '2px solid rgba(28,25,23,0.12)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '8px',
                color: '#78716c',
                marginRight: '8px',
                alignSelf: 'center',
              }}
            >
              TAGS:
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  color: '#57534e',
                  background: '#e4dfd3',
                  border: '1px solid #c4bfb5',
                  padding: '4px 10px',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Author bio — real named author for E-E-A-T */}
        <div
          style={{
            background: '#faf8f4',
            border: '3px solid #1c1917',
            boxShadow: '4px 4px 0 #1c1917',
            padding: '28px',
            marginBottom: '48px',
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>👨‍💻</div>
          <div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: '#1c1917', marginBottom: 6 }}>
              {AUTHOR.name}
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#2563eb', marginBottom: 12 }}>
              {AUTHOR.role.toUpperCase()}
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#44403c', lineHeight: 1.7, margin: 0 }}>
              {AUTHOR.bio}{' '}
              <Link href="/about" style={{ color: '#2563eb' }}>More about the team →</Link>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            background: '#1c1917',
            border: '3px solid #2563eb',
            boxShadow: '4px 4px 0 #2563eb',
            padding: '36px',
            textAlign: 'center',
            marginBottom: '48px',
          }}
        >
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '11px',
              color: '#e5e0d5',
              lineHeight: '1.8',
              margin: '0 0 8px 0',
            }}
          >
            READY TO EXPERIENCE THIS YOURSELF?
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              color: '#a8a29e',
              margin: '0 0 24px 0',
            }}
          >
            Join a match and see how social deduction changes coding forever.
          </p>
          <button
            onClick={() => triggerCinematic('/play')}
            style={{
              display: 'block',
              background: '#2563eb',
              color: '#fff',
              border: '2px solid #1c1917',
              padding: '12px 24px',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '3px 3px 0 #1c1917',
              transition: 'transform 0.1s, box-shadow 0.1s',
              cursor: 'pointer',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '5px 5px 0 #1c1917';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translate(0, 0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 #1c1917';
            }}
          >
            ▶ PLAY NOW
          </button>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '9px',
                  color: '#2563eb',
                  border: '2px solid #2563eb',
                  padding: '4px 10px',
                  display: 'inline-block',
                }}
              >
                MORE FROM {post.category.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: '#faf8f4',
                      border: '3px solid #1c1917',
                      boxShadow: '3px 3px 0 #1c1917',
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '5px 5px 0 #1c1917';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 #1c1917';
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: '9px',
                          color: '#1c1917',
                          lineHeight: '1.7',
                          margin: '0 0 6px 0',
                        }}
                      >
                        {r.title}
                      </p>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '12px',
                          color: '#78716c',
                        }}
                      >
                        {r.readTime} min read
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '10px',
                        color: '#2563eb',
                        flexShrink: 0,
                      }}
                    >
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to blog */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link
            href="/blog"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '8px',
              color: '#1c1917',
              border: '2px solid #1c1917',
              padding: '10px 20px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#1c1917';
              (e.currentTarget as HTMLElement).style.color = '#faf8f4';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#1c1917';
            }}
          >
            ← BACK TO ALL ARTICLES
          </Link>
        </div>
      </div>
    </div>
  );
}

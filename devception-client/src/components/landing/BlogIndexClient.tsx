'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { blogPosts, blogCategories, BlogPost } from '@/lib/blog-data';

const categoryColors: Record<string, string> = {
  'Game Design': '#2563eb',
  'Developer Growth': '#16a34a',
  'Game Psychology': '#9333ea',
  'Developer Life': '#d97706',
  'Behind the Scenes': '#dc2626',
  'Technical': '#0891b2',
  'Guides': '#059669',
};

function BlogCard({ post }: { post: BlogPost }) {
  const color = categoryColors[post.category] || '#2563eb';
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <article
        style={{
          background: '#faf8f4',
          border: '3px solid #1c1917',
          boxShadow: '4px 4px 0 #1c1917',
          padding: '28px',
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #1c1917';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)';
          (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #1c1917';
        }}
      >
        {/* Category badge */}
        <div style={{ marginBottom: '16px' }}>
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '7px',
              color,
              border: `2px solid ${color}`,
              padding: '4px 8px',
              display: 'inline-block',
              letterSpacing: '0.05em',
            }}
          >
            {post.category.toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '12px',
            color: '#1c1917',
            lineHeight: '1.8',
            margin: '0 0 14px 0',
            flex: 1,
          }}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            color: '#44403c',
            lineHeight: '1.7',
            margin: '0 0 20px 0',
          }}
        >
          {post.excerpt}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                color: '#78716c',
                background: '#e4dfd3',
                border: '1px solid #c4bfb5',
                padding: '2px 8px',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Meta footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid rgba(28,25,23,0.12)',
            paddingTop: '14px',
            marginTop: 'auto',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
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
            {post.readTime} MIN READ →
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function BlogIndexClient() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let posts = blogPosts;
    if (activeCategory !== 'All') {
      posts = posts.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return posts;
  }, [activeCategory, searchQuery]);

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
      {/* Header */}
      <div
        style={{
          background: '#faf8f4',
          borderBottom: '3px solid #1c1917',
          padding: '80px 24px 40px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '16px' }}>
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '8px',
                color: '#2563eb',
                border: '2px solid #2563eb',
                padding: '4px 12px',
                display: 'inline-block',
                letterSpacing: '0.08em',
              }}
            >
              DEVCEPTION BLOG
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(18px, 3vw, 28px)',
              color: '#1c1917',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
            }}
          >
            INTEL DISPATCH
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '16px',
              color: '#57534e',
              lineHeight: '1.7',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Game design, developer psychology, technical deep-dives, and growth strategies
            from the team behind Devception.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Search */}
        <div style={{ marginBottom: '32px' }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '12px 16px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              color: '#1c1917',
              background: '#faf8f4',
              border: '3px solid #1c1917',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category filter */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '40px',
          }}
        >
          {blogCategories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '7px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  border: '2px solid #1c1917',
                  background: isActive ? '#1c1917' : '#faf8f4',
                  color: isActive ? '#faf8f4' : '#1c1917',
                  transition: 'all 0.15s ease',
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = '#1c191710';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = '#faf8f4';
                  }
                }}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: '28px' }}>
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '8px',
              color: '#78716c',
            }}
          >
            {filteredPosts.length} ARTICLE{filteredPosts.length !== 1 ? 'S' : ''}
          </span>
        </div>

        {/* Post grid */}
        {filteredPosts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 24px',
              background: '#faf8f4',
              border: '3px solid #1c1917',
            }}
          >
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '12px',
                color: '#78716c',
              }}
            >
              NO ARTICLES FOUND
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                color: '#a8a29e',
                marginTop: '12px',
              }}
            >
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '28px',
            }}
          >
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

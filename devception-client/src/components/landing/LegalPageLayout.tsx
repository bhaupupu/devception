import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LegalPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function LegalPageLayout({
  children,
  title,
  subtitle,
  badge = 'LEGAL',
}: LegalPageLayoutProps) {
  return (
    <div style={{ background: '#f0ece2', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '100px 24px 80px' }}>
        {/* Page header */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: '#2563eb',
              border: '2px solid #2563eb',
              padding: '4px 10px',
              display: 'inline-block',
              marginBottom: 16,
              letterSpacing: '0.15em',
              background: 'rgba(37,99,235,0.05)',
            }}
          >
            {badge}
          </div>
          <h1
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(14px, 2vw, 22px)',
              color: '#1c1917',
              lineHeight: 1.6,
              marginBottom: 12,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 14,
                color: '#44403c',
                lineHeight: 1.7,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Content card */}
        <div
          style={{
            background: '#faf8f4',
            border: '3px solid #1c1917',
            boxShadow: '4px 4px 0 #1c1917',
            padding: '40px 48px',
          }}
        >
          <style>{`
            .legal-content h2 {
              font-family: 'Press Start 2P', monospace;
              font-size: 11px;
              color: #1c1917;
              margin: 32px 0 14px;
              line-height: 1.7;
              padding-bottom: 8px;
              border-bottom: 2px solid rgba(37,99,235,0.2);
            }
            .legal-content h2:first-child { margin-top: 0; }
            .legal-content p {
              font-family: 'Space Mono', monospace;
              font-size: 13px;
              color: #44403c;
              line-height: 1.9;
              margin-bottom: 16px;
            }
            .legal-content ul {
              margin: 0 0 16px 24px;
            }
            .legal-content li {
              font-family: 'Space Mono', monospace;
              font-size: 13px;
              color: #44403c;
              line-height: 1.9;
              margin-bottom: 6px;
            }
            .legal-content strong { color: #1c1917; font-weight: 700; }
            .legal-content a { color: #2563eb; text-decoration: underline; }
            .legal-content a:hover { color: #1d4ed8; }
            .legal-content table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-family: 'Space Mono', monospace;
              font-size: 12px;
            }
            .legal-content th {
              background: #1c1917;
              color: #faf8f4;
              padding: 10px 14px;
              text-align: left;
              font-family: 'Press Start 2P', monospace;
              font-size: 7px;
            }
            .legal-content td {
              padding: 10px 14px;
              color: #44403c;
              border-bottom: 1px solid rgba(28,25,23,0.1);
            }
            .legal-content tr:nth-child(even) td { background: rgba(37,99,235,0.03); }
          `}</style>
          <div className="legal-content">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

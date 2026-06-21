import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Devception — Multiplayer Social Deduction Coding Game';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Sitewide default Open Graph / Twitter card image (raster PNG, generated at the edge).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#f0ece2',
          backgroundImage:
            'linear-gradient(rgba(28,25,23,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(28,25,23,0.07) 2px, transparent 2px)',
          backgroundSize: '48px 48px',
          padding: '72px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 4,
            color: '#2563eb',
            marginBottom: 28,
          }}
        >
          {'>'} DEVCEPTION
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.05,
            color: '#1c1917',
          }}
        >
          One of your teammates
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.05,
            color: '#1c1917',
          }}
        >
          is&nbsp;<span style={{ color: '#dc2626' }}>lying.</span>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            color: '#44403c',
            marginTop: 36,
          }}
        >
          A multiplayer social deduction coding game · 4–8 players
        </div>
      </div>
    ),
    { ...size }
  );
}

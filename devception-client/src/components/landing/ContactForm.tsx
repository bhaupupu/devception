'use client';
import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface FormData {
  name: string;
  email: string;
  type: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  type?: string;
  message?: string;
}

const CONTACT_TYPES = [
  'General Question',
  'Bug Report',
  'Partnership Inquiry',
  'Business Inquiry',
  'Press / Media',
  'Other',
];

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', type: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name || form.name.trim().length < 2) e.name = 'NAME MUST BE AT LEAST 2 CHARACTERS';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'PLEASE ENTER A VALID EMAIL';
    if (!form.type) e.type = 'PLEASE SELECT A SUBJECT TYPE';
    if (!form.message || form.message.trim().length < 20) e.message = 'MESSAGE MUST BE AT LEAST 20 CHARACTERS';
    if (form.message && form.message.length > 2000) e.message = 'MESSAGE MUST BE UNDER 2000 CHARACTERS';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    fontFamily: "'Space Mono', monospace",
    fontSize: 13,
    color: '#1c1917',
    background: '#faf8f4',
    border: '2px solid #1c1917',
    outline: 'none',
    boxSizing: 'border-box',
    display: 'block',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 7,
    color: '#1c1917',
    display: 'block',
    marginBottom: 8,
    letterSpacing: '0.1em',
  };

  const errorStyle: React.CSSProperties = {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 6,
    color: '#dc2626',
    marginTop: 6,
    display: 'block',
    padding: '3px 6px',
    background: 'rgba(220,38,38,0.06)',
    border: '1px solid rgba(220,38,38,0.3)',
  };

  return (
    <div style={{ background: '#f0ece2', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
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
            GET IN TOUCH
          </div>
          <h1
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(16px, 2.2vw, 28px)',
              color: '#1c1917',
              lineHeight: 1.6,
              marginBottom: 12,
            }}
          >
            CONTACT US
          </h1>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 15,
              color: '#44403c',
              lineHeight: 1.7,
            }}
          >
            Questions? Bugs? Partnership ideas? We read every message and reply within 48 hours.
          </p>
        </div>

        {submitted ? (
          /* ─── Success State ─── */
          <div
            className="game-panel"
            style={{
              padding: 60,
              textAlign: 'center',
              maxWidth: 600,
              margin: '0 auto',
              borderColor: '#16a34a',
              boxShadow: '4px 4px 0 #16a34a',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 24 }}>✉️</div>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 14,
                color: '#16a34a',
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              MESSAGE RECEIVED.
            </div>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 14,
                color: '#44403c',
                lineHeight: 1.8,
                marginBottom: 32,
              }}
            >
              We&apos;ll get back to you at <strong>{form.email}</strong> within 48 hours.
              Thanks for reaching out!
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', type: '', message: '' }); }}
              className="pixel-btn pixel-btn-light"
              style={{ fontSize: 8 }}
            >
              ↺ SEND ANOTHER MESSAGE
            </button>
          </div>
        ) : (
          /* ─── Form + Info ─── */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 360px',
              gap: 32,
              alignItems: 'start',
            }}
          >
            {/* Form */}
            <div className="game-panel" style={{ padding: 40 }}>
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>YOUR NAME *</label>
                  <input
                    type="text"
                    style={{ ...inputStyle, borderColor: errors.name ? '#dc2626' : '#1c1917' }}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                    maxLength={100}
                  />
                  {errors.name && <span style={errorStyle}>{errors.name}</span>}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    style={{ ...inputStyle, borderColor: errors.email ? '#dc2626' : '#1c1917' }}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    maxLength={200}
                  />
                  {errors.email && <span style={errorStyle}>{errors.email}</span>}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>SUBJECT TYPE *</label>
                  <select
                    style={{ ...inputStyle, borderColor: errors.type ? '#dc2626' : '#1c1917', appearance: 'none', cursor: 'pointer' }}
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="">Select a subject...</option>
                    {CONTACT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.type && <span style={errorStyle}>{errors.type}</span>}
                </div>

                <div style={{ marginBottom: 32 }}>
                  <label style={labelStyle}>
                    MESSAGE * ({form.message.length}/2000)
                  </label>
                  <textarea
                    rows={6}
                    style={{ ...inputStyle, resize: 'vertical', borderColor: errors.message ? '#dc2626' : '#1c1917' }}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Write your message here (minimum 20 characters)..."
                    maxLength={2000}
                  />
                  {errors.message && <span style={errorStyle}>{errors.message}</span>}
                </div>

                <button type="submit" className="pixel-btn pixel-btn-blue" style={{ fontSize: 9, width: '100%' }}>
                  SEND MESSAGE →
                </button>
              </form>
            </div>

            {/* Info card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="game-panel" style={{ padding: 28 }}>
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 8,
                    color: '#2563eb',
                    marginBottom: 20,
                    letterSpacing: '0.1em',
                  }}
                >
                  📧 CONTACT INFO
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#78716c', marginBottom: 6 }}>
                      EMAIL
                    </div>
                    <a
                      href="mailto:team@devception.com"
                      style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#2563eb' }}
                    >
                      team@devception.com
                    </a>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#78716c', marginBottom: 6 }}>
                      RESPONSE TIME
                    </div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#44403c' }}>
                      Within 48 hours
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#78716c', marginBottom: 6 }}>
                      FOR BUGS
                    </div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#44403c' }}>
                      Use &quot;Bug Report&quot; subject above for fastest response
                    </div>
                  </div>
                </div>
              </div>

              <div className="game-panel" style={{ padding: 28, borderColor: '#16a34a', boxShadow: '3px 3px 0 #16a34a' }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: '#16a34a', marginBottom: 12 }}>
                  ✓ WE REPLY TO EVERY MESSAGE
                </div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#44403c', lineHeight: 1.7, marginBottom: 0 }}>
                  No auto-replies. Real humans read and respond to all inquiries, including bug reports, partnership ideas, and general questions.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 768px) {
          form + div { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Footer />
    </div>
  );
}

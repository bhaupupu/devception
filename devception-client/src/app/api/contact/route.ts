import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contact form handler.
// To actually deliver messages, set CONTACT_WEBHOOK_URL in your environment to a
// Formspree / Zapier / Discord / custom webhook endpoint. If it is not set, the
// submission is accepted gracefully (logged server-side) so the form never breaks.
export async function POST(req: Request) {
  let body: { name?: string; email?: string; type?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  const name = String(body?.name ?? '').trim();
  const email = String(body?.email ?? '').trim();
  const type = String(body?.type ?? '').trim();
  const message = String(body?.message ?? '').trim();

  if (name.length < 2) return NextResponse.json({ ok: false, error: 'Name is too short.' }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: 'Please enter a valid email.' }, { status: 400 });
  if (!type) return NextResponse.json({ ok: false, error: 'Please select a subject type.' }, { status: 400 });
  if (message.length < 20 || message.length > 2000) {
    return NextResponse.json({ ok: false, error: 'Message must be 20–2000 characters.' }, { status: 400 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'devception-contact', name, email, type, message }),
      });
    } catch (err) {
      // A downstream hiccup should not fail the user's submission.
      console.error('[contact] webhook forward failed:', err);
    }
  } else {
    console.log('[contact] message received (set CONTACT_WEBHOOK_URL to deliver):', { name, email, type });
  }

  return NextResponse.json({ ok: true });
}

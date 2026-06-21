import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Devception Contact" <${smtpUser}>`,
        to: 'guptadiwanshu2007@gmail.com',
        replyTo: email,
        subject: `[Devception Contact] ${type} from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nType: ${type}\n\nMessage:\n${message}`,
      });
    } catch (err) {
      console.error('[contact] email delivery failed:', err);
    }
  } else {
    // Fallback to webhook if SMTP is not configured
    const webhook = process.env.CONTACT_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source: 'devception-contact', name, email, type, message }),
        });
      } catch (err) {
        console.error('[contact] webhook forward failed:', err);
      }
    } else {
      console.log('[contact] message received (SMTP/Webhook not configured):', { name, email, type });
    }
  }

  return NextResponse.json({ ok: true });
}

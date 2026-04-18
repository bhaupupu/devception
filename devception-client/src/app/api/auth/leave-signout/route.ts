import { NextResponse } from 'next/server';

// Called via navigator.sendBeacon() from the game page when a player closes the tab.
// Clears NextAuth session cookies so the user is effectively signed out on next return.
// No CSRF token needed — this endpoint only deletes cookies and is safe to hit blindly.
export async function POST(): Promise<NextResponse> {
  const res = NextResponse.json({ ok: true });

  // Clear all NextAuth session cookies. Both the non-secure and secure variants exist
  // depending on deployment — expire them all to be thorough.
  const cookieNames = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'next-auth.csrf-token',
    '__Host-next-auth.csrf-token',
    'next-auth.callback-url',
    '__Secure-next-auth.callback-url',
  ];
  for (const name of cookieNames) {
    res.cookies.set(name, '', { path: '/', expires: new Date(0) });
  }
  return res;
}

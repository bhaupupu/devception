import { NextResponse } from 'next/server';

// DEPRECATED — retained as a no-op to absorb any in-flight navigator.sendBeacon
// calls fired by older client bundles. The previous implementation deleted
// NextAuth cookies on every `beforeunload`, which auto-logged-out users on
// page refresh or internal navigation. That cookie wipe has been removed;
// real sign-out now goes through NextAuth's /api/auth/signout endpoint.
export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ ok: true });
}

'use client';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { connectSocket, disconnectSocket, AppSocket } from '@/lib/socket';

export function useSocket(): AppSocket | null {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<AppSocket | null>(null);

  useEffect(() => {
    const token = (session as { accessToken?: string })?.accessToken;
    if (!token) return;

    const s = connectSocket(token);
    setSocket(s);
  }, [(session as { accessToken?: string })?.accessToken]);

  // One active session per user is enforced server-side: when the same Google
  // account signs in elsewhere, the server emits `session:force-logout` to the
  // displaced socket. We surface that to the user, sign them out of NextAuth
  // locally, and bounce them to /login with a contextual reason. This prevents
  // the ghost-socket behavior where an old tab kept receiving broadcasts for a
  // game seat that had been handed to the new session.
  useEffect(() => {
    if (!socket) return;
    const onForceLogout = (data: { reason?: string; message?: string }) => {
      disconnectSocket();
      const reason = data.reason ?? 'signed-in-elsewhere';
      signOut({ redirect: false }).finally(() => {
        const url = `/login?reason=${encodeURIComponent(reason)}`;
        if (typeof window !== 'undefined') window.location.replace(url);
      });
    };
    socket.on('session:force-logout', onForceLogout);
    return () => { socket.off('session:force-logout', onForceLogout); };
  }, [socket]);

  return socket;
}

export function useSocketDisconnect(): () => void {
  return disconnectSocket;
}

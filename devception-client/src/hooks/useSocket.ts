'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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

  return socket;
}

export function useSocketDisconnect(): () => void {
  return disconnectSocket;
}

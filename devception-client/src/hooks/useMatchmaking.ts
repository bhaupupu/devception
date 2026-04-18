'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface MatchmakingState {
  status: 'idle' | 'queued' | 'matched' | 'error';
  position: number;
  total: number;
  roomCode: string | null;
  error: string | null;
}

export function useMatchmaking() {
  const { data: session } = useSession();
  const router = useRouter();
  const token = (session as { accessToken?: string })?.accessToken;
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [state, setState] = useState<MatchmakingState>({
    status: 'idle',
    position: 0,
    total: 0,
    roomCode: null,
    error: null,
  });

  const joinQueue = useCallback(
    async (skillLevel: string, language: string) => {
      if (!token) return;
      try {
        await api.post('/matchmaking/join', { skillLevel, language }, token);
        setState((s) => ({ ...s, status: 'queued', error: null }));

        pollRef.current = setInterval(async () => {
          const status = await api.get<{
            inQueue: boolean;
            position?: number;
            total?: number;
            roomCode?: string;
          }>('/matchmaking/status', token);

          if (!status.inQueue && status.roomCode) {
            clearInterval(pollRef.current!);
            setState((s) => ({ ...s, status: 'matched', roomCode: status.roomCode! }));
            router.push(`/lobby/${status.roomCode}`);
          } else if (status.inQueue) {
            setState((s) => ({
              ...s,
              position: status.position ?? s.position,
              total: status.total ?? s.total,
            }));
          }
        }, 2000);
      } catch (e: unknown) {
        setState((s) => ({
          ...s,
          status: 'error',
          error: e instanceof Error ? e.message : 'Failed to join queue',
        }));
      }
    },
    [token, router]
  );

  const leaveQueue = useCallback(async () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!token) return;
    await api.delete('/matchmaking/leave', token).catch(() => {});
    setState({ status: 'idle', position: 0, total: 0, roomCode: null, error: null });
  }, [token]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return { ...state, joinQueue, leaveQueue };
}

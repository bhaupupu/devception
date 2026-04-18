'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { AppSocket } from '@/lib/socket';

interface CooldownState {
  bug: number;
  blur: number;
  hint: number;
  lock: number;
}

export function useImposter(socket: AppSocket | null, roomCode: string) {
  const [cooldowns, setCooldowns] = useState<CooldownState>({ bug: 0, blur: 0, hint: 0, lock: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('imposter:cooldown-update', ({ remainingMs, startCooldown, cooldownMs }) => {
      if (startCooldown && cooldownMs) {
        // Clear any existing countdown before starting a new one
        if (intervalRef.current) clearInterval(intervalRef.current);
        // All abilities share the same cooldown
        setCooldowns({ bug: cooldownMs, blur: cooldownMs, hint: cooldownMs, lock: cooldownMs });
        intervalRef.current = setInterval(() => {
          setCooldowns((prev) => {
            const next = Math.max(0, prev.bug - 1000);
            if (next <= 0) {
              clearInterval(intervalRef.current!);
              intervalRef.current = null;
              return { bug: 0, blur: 0, hint: 0, lock: 0 };
            }
            return { bug: next, blur: next, hint: next, lock: next };
          });
        }, 1000);
      } else {
        setCooldowns({ bug: remainingMs, blur: remainingMs, hint: remainingMs, lock: remainingMs });
      }
    });

    return () => {
      socket.off('imposter:cooldown-update');
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [socket]);

  const injectBug = useCallback(
    (targetLine: number, bugCode: string) => {
      socket?.emit('imposter:inject-bug', { roomCode, targetLine, bugCode });
    },
    [socket, roomCode]
  );

  const blurScreen = useCallback(
    (targetUserId: string) => {
      socket?.emit('imposter:blur-screen', { roomCode, targetUserId });
    },
    [socket, roomCode]
  );

  const sendHint = useCallback(
    (hintText: string) => {
      socket?.emit('imposter:send-hint', { roomCode, hintText });
    },
    [socket, roomCode]
  );

  const lockKeyboard = useCallback(
    (targetUserId: string) => {
      socket?.emit('imposter:lock-keyboard', { roomCode, targetUserId });
    },
    [socket, roomCode]
  );

  return { cooldowns, injectBug, blurScreen, sendHint, lockKeyboard };
}

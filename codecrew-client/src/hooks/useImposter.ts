'use client';
import { useState, useEffect, useCallback } from 'react';
import { AppSocket } from '@/lib/socket';

interface CooldownState {
  bug: number;
  blur: number;
  hint: number;
  lock: number;
}

export function useImposter(socket: AppSocket | null, roomCode: string) {
  const [cooldowns, setCooldowns] = useState<CooldownState>({ bug: 0, blur: 0, hint: 0, lock: 0 });

  useEffect(() => {
    if (!socket) return;

    socket.on('imposter:cooldown-update', ({ action, remainingMs, startCooldown, cooldownMs }) => {
      if (startCooldown && cooldownMs) {
        setCooldowns((prev) => ({ ...prev, [action]: cooldownMs }));
        // Count down locally
        const interval = setInterval(() => {
          setCooldowns((prev) => {
            const next = Math.max(0, prev[action as keyof CooldownState] - 1000);
            if (next <= 0) clearInterval(interval);
            return { ...prev, [action]: next };
          });
        }, 1000);
      } else {
        setCooldowns((prev) => ({ ...prev, [action]: remainingMs }));
      }
    });

    return () => {
      socket.off('imposter:cooldown-update');
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

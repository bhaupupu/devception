'use client';
import { useCallback } from 'react';
import { AppSocket } from '@/lib/socket';
import { useChatStore } from '@/store/chatStore';

export function useChat(socket: AppSocket | null, roomCode: string) {
  const { messages } = useChatStore();

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      socket?.emit('chat:send', { roomCode, message: text });
    },
    [socket, roomCode]
  );

  return { messages, sendMessage };
}

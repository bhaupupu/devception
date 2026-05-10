'use client';
import { useCallback, useRef } from 'react';
import { AppSocket } from '@/lib/socket';
import { useEditorStore } from '@/store/editorStore';

export function useEditor(socket: AppSocket | null, roomCode: string) {
  const { code } = useEditorStore();
  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCursorMove = useCallback(
    (line: number, column: number) => {
      if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);
      cursorTimerRef.current = setTimeout(() => {
        socket?.emit('editor:cursor-move', { roomCode, line, column });
      }, 80);
    },
    [socket, roomCode]
  );

  return { code, handleCursorMove };
}

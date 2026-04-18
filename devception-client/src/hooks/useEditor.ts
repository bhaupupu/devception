'use client';
import { useCallback, useRef } from 'react';
import { AppSocket } from '@/lib/socket';
import { useEditorStore } from '@/store/editorStore';

export function useEditor(socket: AppSocket | null, roomCode: string) {
  const { code, version, setCode } = useEditorStore();
  const changeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (newCode: string) => {
      setCode(newCode, version + 1);

      // Throttle: emit max every 50ms
      if (changeTimerRef.current) clearTimeout(changeTimerRef.current);
      changeTimerRef.current = setTimeout(() => {
        socket?.emit('editor:change', {
          roomCode,
          fullContent: newCode,
          version,
        });
      }, 50);
    },
    [socket, roomCode, version, setCode]
  );

  const handleCursorMove = useCallback(
    (line: number, column: number) => {
      if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);
      cursorTimerRef.current = setTimeout(() => {
        socket?.emit('editor:cursor-move', { roomCode, line, column });
      }, 80);
    },
    [socket, roomCode]
  );

  return { code, handleChange, handleCursorMove };
}

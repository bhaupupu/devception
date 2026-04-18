'use client';
import { useCallback, useRef } from 'react';
import { AppSocket } from '@/lib/socket';
import type { EditorOp } from '@/types/socket';
import { useEditorStore } from '@/store/editorStore';

export function useEditor(socket: AppSocket | null, roomCode: string) {
  const { code } = useEditorStore();
  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Emit a batch of Monaco ops (from one `onDidChangeModelContent` event) together,
  // tagged with the baseVersion the client had when the edit was authored.
  const emitOps = useCallback(
    (ops: EditorOp[], baseVersion: number) => {
      if (!socket || !ops.length) return;
      socket.emit('editor:op', { roomCode, ops, baseVersion });
    },
    [socket, roomCode]
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

  return { code, emitOps, handleCursorMove };
}

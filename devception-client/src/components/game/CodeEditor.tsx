'use client';
import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useEditorStore } from '@/store/editorStore';
import { getSocket } from '@/lib/socket';
import type { EditorOp } from '@/types/socket';
import type { Monaco } from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Props {
  // Called with a batch of ops and the baseVersion they were authored against.
  // The hook wires this to the `editor:op` socket emission.
  onOps: (ops: EditorOp[], baseVersion: number) => void;
  onCursorMove: (line: number, column: number) => void;
  language: string;
  readOnly?: boolean;
  onProtectedViolation?: (message: string) => void;
  roomCode?: string;
}

export function CodeEditor({ roomCode, onOps, onCursorMove, language, readOnly = false, onProtectedViolation }: Props) {
  const { code, version, resetNonce, protectedRanges, cursors } = useEditorStore();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const protectedDecorationsRef = useRef<string[]>([]);

  const onViolationRef = useRef(onProtectedViolation);
  useEffect(() => { onViolationRef.current = onProtectedViolation; }, [onProtectedViolation]);
  const protectedRef = useRef(protectedRanges);
  useEffect(() => { protectedRef.current = protectedRanges; }, [protectedRanges]);

  // Hard resync (if server rejects an edit or sends a forced reset)
  useEffect(() => {
    const ydoc = ydocRef.current;
    if (!ydoc) return;
    const ytext = ydoc.getText('monaco');
    if (ytext.toString() !== code) {
      ydoc.transact(() => {
        ytext.delete(0, ytext.length);
        ytext.insert(0, code);
      });
    }
  }, [resetNonce]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Inject cursor highlight CSS (background + left border per user color).
  useEffect(() => {
    let styleEl = document.getElementById('remote-cursor-styles') as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'remote-cursor-styles';
      document.head.appendChild(styleEl);
    }
    let css = '';
    Array.from(cursors.values()).forEach((c) => {
      const safeId = c.userId.replace(/[^a-zA-Z0-9]/g, '');
      css += `
        .rcursor-${safeId} {
          background-color: ${c.color}40;
          border-left: 2px solid ${c.color};
          min-width: 2px;
        }
      `;
    });
    css += `
      .protected-line { background-color: rgba(239,125,14,0.07) !important; }
      .protected-line-gutter::before { content: '🔒'; padding-right: 4px; font-size: 10px; }
    `;
    styleEl.textContent = css;
  }, [cursors]);

  // ── Yjs Setup and Socket Sync
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !roomCode) return;

    if (ydocRef.current) {
      ydocRef.current.destroy();
    }
    
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // Send updates to the server
    ydoc.on('update', (update: Uint8Array, origin: any) => {
      if (origin !== 'server') {
        socket.emit('editor:ydoc-sync', { roomCode, update: update.buffer as ArrayBuffer });
      }
    });

    // Listen for incoming Yjs updates from the server
    const onYDocSync = (data: { update: ArrayBuffer }) => {
      Y.applyUpdate(ydoc, new Uint8Array(data.update), 'server');
    };

    // Legacy resync for protected violation
    const onResync = (data: { fullContent: string; version: number }) => {
      useEditorStore.getState().resyncCode(data.fullContent, data.version);
    };

    socket.on('editor:ydoc-sync', onYDocSync);
    socket.on('editor:resync', onResync);

    // Bind Monaco once editor is ready
    if (editorRef.current) {
      const ytext = ydoc.getText('monaco');
      // Initialize with code if empty
      if (ytext.length === 0 && code) {
        ytext.insert(0, code);
      }
      bindingRef.current = new MonacoBinding(
        ytext,
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        null // We can add awareness provider here later
      );
    }

    return () => {
      socket.off('editor:ydoc-sync', onYDocSync);
      socket.off('editor:resync', onResync);
      if (bindingRef.current) bindingRef.current.destroy();
      ydoc.destroy();
    };
  }, [roomCode]); // Setup once per room

  function handleMount(editorInstance: any, monaco: Monaco) {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;

    const model = editorInstance.getModel();
    if (model) {
      if (ydocRef.current && !bindingRef.current) {
        const ytext = ydocRef.current.getText('monaco');
        if (ytext.length === 0 && code) {
          ytext.insert(0, code);
        }
        bindingRef.current = new MonacoBinding(
          ytext,
          model,
          new Set([editorInstance]),
          null
        );
      }

      model.onDidChangeContent((e: any) => {
        if (e.isFlush) return;

        const ranges = protectedRef.current;
        if (ranges && ranges.length > 0) {
          const overlaps = e.changes.some((ch: any) => {
            const startLine = model.getPositionAt(ch.rangeOffset).lineNumber;
            const endLine = model.getPositionAt(ch.rangeOffset + ch.rangeLength).lineNumber;
            return ranges.some((r) => !(endLine < r.startLine || startLine > r.endLine));
          });
          if (overlaps) {
            onViolationRef.current?.('Protected region cannot be modified.');
            // Undo local edit immediately
            editorInstance.trigger('protected-guard', 'undo', null);
          }
        }
      });
    }

    editorInstance.onDidChangeCursorPosition((e: any) => {
      onCursorMove(e.position.lineNumber, e.position.column);
    });
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <MonacoEditor
        height="100%"
        language={language === 'cpp' ? 'cpp' : language}
        defaultValue={code}
        theme="vs-dark"
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 22,
          tabSize: 2,
          readOnly,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 12, bottom: 12 },
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
          cursorBlinking: 'smooth',
          smoothScrolling: true,
        }}
      />
    </div>
  );
}

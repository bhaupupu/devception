'use client';
import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useEditorStore } from '@/store/editorStore';
import { getSocket } from '@/lib/socket';
import type { EditorOp } from '@/types/socket';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Props {
  // Called with a batch of ops and the baseVersion they were authored against.
  // The hook wires this to the `editor:op` socket emission.
  onOps: (ops: EditorOp[], baseVersion: number) => void;
  onCursorMove: (line: number, column: number) => void;
  language: string;
  readOnly?: boolean;
  onProtectedViolation?: (message: string) => void;
}

export function CodeEditor({ onOps, onCursorMove, language, readOnly = false, onProtectedViolation }: Props) {
  const { code, version, resetNonce, protectedRanges, cursors } = useEditorStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const protectedDecorationsRef = useRef<string[]>([]);
  const widgetsRef = useRef<Map<string, editor.IContentWidget>>(new Map());

  // Guards reentrance when applying REMOTE ops via model.applyEdits — prevents echo.
  const isApplyingRemoteRef = useRef(false);
  // Tracks the authoritative server version the local model is currently at.
  const versionRef = useRef(0);
  // Ref to the onOps callback so event listeners always see the latest closure.
  const onOpsRef = useRef(onOps);
  useEffect(() => { onOpsRef.current = onOps; }, [onOps]);
  const onViolationRef = useRef(onProtectedViolation);
  useEffect(() => { onViolationRef.current = onProtectedViolation; }, [onProtectedViolation]);
  const protectedRef = useRef(protectedRanges);
  useEffect(() => { protectedRef.current = protectedRanges; }, [protectedRanges]);

  // ── Initial / hard-resync set: only call model.setValue when resetNonce advances.
  // This is the ONLY place we wipe the undo stack — necessary for fresh games and
  // for version-conflict resyncs. Normal remote edits go through applyEdits below.
  useEffect(() => {
    const ed = editorRef.current;
    const model = ed?.getModel();
    if (!ed || !model) return;
    isApplyingRemoteRef.current = true;
    model.setValue(code);
    versionRef.current = version;
    isApplyingRemoteRef.current = false;
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

  // ── Apply decorations + content widgets for remote cursors.
  useEffect(() => {
    const editorInstance = editorRef.current;
    const monacoInstance = monacoRef.current;
    if (!editorInstance || !monacoInstance) return;
    const model = editorInstance.getModel();
    if (!model) return;

    widgetsRef.current.forEach((w) => editorInstance.removeContentWidget(w));
    widgetsRef.current.clear();

    const newDecorations = Array.from(cursors.entries()).map(([uid, c]) => {
      const safeId = uid.replace(/[^a-zA-Z0-9]/g, '');

      const labelEl = document.createElement('div');
      labelEl.textContent = c.displayName.slice(0, 20);
      labelEl.style.cssText = [
        `background:${c.color}`,
        'color:#fff',
        'font-size:10px',
        'font-family:monospace',
        'padding:1px 6px',
        'border-radius:3px 3px 3px 0',
        'white-space:nowrap',
        'pointer-events:none',
        'line-height:16px',
        'position:relative',
        'z-index:9999',
      ].join(';');

      const widget: editor.IContentWidget = {
        getId: () => `rcursor-widget-${safeId}`,
        getDomNode: () => labelEl,
        getPosition: () => ({
          position: { lineNumber: c.line, column: c.column },
          preference: [
            monacoInstance.editor.ContentWidgetPositionPreference.ABOVE,
            monacoInstance.editor.ContentWidgetPositionPreference.BELOW,
          ],
        }),
      };
      editorInstance.addContentWidget(widget);
      widgetsRef.current.set(uid, widget);

      return {
        range: {
          startLineNumber: c.line,
          startColumn: c.column,
          endLineNumber: c.line,
          endColumn: c.column + 1,
        },
        options: { className: `rcursor-${safeId}`, stickiness: 1, zIndex: 10 },
      };
    });

    decorationsRef.current = editorInstance.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );

    return () => {
      widgetsRef.current.forEach((w) => editorInstance.removeContentWidget(w));
      widgetsRef.current.clear();
    };
  }, [cursors]);

  // ── Paint protected-range decorations.
  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    const next = protectedRanges.map((r) => ({
      range: {
        startLineNumber: r.startLine,
        startColumn: 1,
        endLineNumber: r.endLine,
        endColumn: 1,
      },
      options: {
        isWholeLine: true,
        className: 'protected-line',
        linesDecorationsClassName: 'protected-line-gutter',
        hoverMessage: { value: `🔒 Protected: ${r.name}` },
      },
    }));
    protectedDecorationsRef.current = ed.deltaDecorations(protectedDecorationsRef.current, next);
  }, [protectedRanges]);

  // ── Subscribe to the socket's remote-op stream and apply via applyEdits (no undo-stack impact).
  // Also handles authoritative resync from the server.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onOpApply = (data: { userId: string; ops: EditorOp[]; version: number }) => {
      const ed = editorRef.current;
      const model = ed?.getModel();
      if (!ed || !model) return;
      isApplyingRemoteRef.current = true;
      try {
        const edits = data.ops.map((op) => {
          const startPos = model.getPositionAt(op.rangeOffset);
          const endPos = model.getPositionAt(op.rangeOffset + op.rangeLength);
          return {
            range: {
              startLineNumber: startPos.lineNumber,
              startColumn: startPos.column,
              endLineNumber: endPos.lineNumber,
              endColumn: endPos.column,
            },
            text: op.text,
            forceMoveMarkers: false,
          };
        });
        model.applyEdits(edits);
        versionRef.current = data.version;
        useEditorStore.getState().setCodeMirror(model.getValue(), data.version);
      } finally {
        isApplyingRemoteRef.current = false;
      }
    };

    const onResync = (data: { fullContent: string; version: number }) => {
      useEditorStore.getState().resyncCode(data.fullContent, data.version);
    };

    socket.on('editor:op-apply', onOpApply);
    socket.on('editor:resync', onResync);
    return () => {
      socket.off('editor:op-apply', onOpApply);
      socket.off('editor:resync', onResync);
    };
  }, []);

  function handleMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;

    const model = editorInstance.getModel();
    if (model) {
      // Seed the model with the current known code (for the first mount).
      isApplyingRemoteRef.current = true;
      model.setValue(code);
      versionRef.current = version;
      isApplyingRemoteRef.current = false;

      // Listen for content changes. Filter out remote ops (set by isApplyingRemoteRef).
      model.onDidChangeContent((e) => {
        if (isApplyingRemoteRef.current || e.isFlush) return;

        // Intercept edits that overlap any protected range — undo immediately for UX,
        // server still rejects as the authoritative guard.
        const ranges = protectedRef.current;
        if (ranges && ranges.length > 0) {
          const overlaps = e.changes.some((ch) => {
            const startLine = model.getPositionAt(ch.rangeOffset).lineNumber;
            const endLine = model.getPositionAt(ch.rangeOffset + ch.rangeLength).lineNumber;
            return ranges.some((r) => !(endLine < r.startLine || startLine > r.endLine));
          });
          if (overlaps) {
            onViolationRef.current?.('Protected region cannot be modified.');
            // Undo the local edit off the undo stack so the user's Ctrl+Z state stays clean.
            editorInstance.trigger('protected-guard', 'undo', null);
            return;
          }
        }

        // Each Monaco change has rangeOffset/rangeLength; that's exactly what the server wants.
        const ops: EditorOp[] = e.changes.map((ch) => ({
          rangeOffset: ch.rangeOffset,
          rangeLength: ch.rangeLength,
          text: ch.text,
        }));
        const baseVersion = versionRef.current;
        versionRef.current = baseVersion + 1; // optimistic local bump
        onOpsRef.current(ops, baseVersion);
        useEditorStore.getState().setCodeMirror(model.getValue(), versionRef.current);
      });
    }

    editorInstance.onDidChangeCursorPosition((e) => {
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

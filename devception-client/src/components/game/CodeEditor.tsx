'use client';
import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useEditorStore } from '@/store/editorStore';
import { getSocket } from '@/lib/socket';
import type { Monaco } from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';

import { useSession } from 'next-auth/react';
import type { editor } from 'monaco-editor';

const DEMO_ACCOUNTS = ['demo1@devception.com', 'demo2@devception.com', 'demo3@devception.com', 'demo4@devception.com'];

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

class RemoteCursorWidget implements editor.IContentWidget {
  private id: string;
  private domNode: HTMLDivElement;
  private position: { lineNumber: number; column: number } | null = null;

  constructor(userId: string, color: string, name: string) {
    this.id = `rcursor-widget-${userId}`;
    this.domNode = document.createElement('div');
    this.domNode.textContent = name;
    this.domNode.style.backgroundColor = color;
    this.domNode.style.color = '#fff';
    this.domNode.style.fontSize = '10px';
    this.domNode.style.padding = '2px 4px';
    this.domNode.style.borderRadius = '2px';
    this.domNode.style.whiteSpace = 'nowrap';
    this.domNode.style.pointerEvents = 'none';
    this.domNode.style.zIndex = '50';
    this.domNode.style.fontFamily = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace";
  }

  getId(): string {
    return this.id;
  }

  getDomNode(): HTMLElement {
    return this.domNode;
  }

  getPosition(): editor.IContentWidgetPosition | null {
    if (!this.position) return null;
    return {
      position: this.position,
      preference: [1] // 1 = ABOVE
    };
  }

  update(lineNumber: number, column: number) {
    this.position = { lineNumber, column };
  }
}

interface Props {
  onCursorMove: (line: number, column: number) => void;
  language: string;
  readOnly?: boolean;
  onProtectedViolation?: (message: string) => void;
  roomCode?: string;
}

export function CodeEditor({ roomCode, onCursorMove, language, readOnly = false, onProtectedViolation }: Props) {
  const { data: session } = useSession();
  const canBypassProtection = DEMO_ACCOUNTS.includes(session?.user?.email ?? '');
  const finalReadOnly = readOnly;

  const { protectedRanges, cursors } = useEditorStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
  const widgetsRef = useRef<Map<string, RemoteCursorWidget>>(new Map());

  const onViolationRef = useRef(onProtectedViolation);
  useEffect(() => { onViolationRef.current = onProtectedViolation; }, [onProtectedViolation]);
  const protectedRef = useRef(protectedRanges);
  useEffect(() => { protectedRef.current = protectedRanges; }, [protectedRanges]);

  useEffect(() => {
    if (canBypassProtection) return;
    const handleCopyCut = (e: ClipboardEvent) => {
      if (!editorRef.current) return;
      const selection = editorRef.current.getSelection();
      if (selection && selection.startLineNumber !== selection.endLineNumber) {
        e.preventDefault();
        onViolationRef.current?.('Copying or cutting multiple lines is not allowed.');
      }
    };
    document.addEventListener('copy', handleCopyCut);
    document.addEventListener('cut', handleCopyCut);
    return () => {
      document.removeEventListener('copy', handleCopyCut);
      document.removeEventListener('cut', handleCopyCut);
    };
  }, [canBypassProtection]);

  // NOTE: The Y.Doc is the single source of truth for editor content.
  // Hard-resync via resetNonce has been removed — it caused a cascade where
  // every setInitialCode call mutated the Y.Doc, fired editor:ydoc-sync to
  // the server, which rebroadcast to all N clients, producing N×N template
  // duplications. Editor content is bootstrapped exclusively via
  // editor:request-state → server state-vector → onYDocSync.

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

    if (!editorRef.current) return;
    
    const newDecorations: editor.IModelDeltaDecoration[] = [];
    cursors.forEach((c) => {
      const safeId = c.userId.replace(/[^a-zA-Z0-9]/g, '');
      newDecorations.push({
        range: { startLineNumber: c.line, startColumn: c.column, endLineNumber: c.line, endColumn: c.column },
        options: {
          className: `rcursor-${safeId}`,
          hoverMessage: { value: c.displayName },
        }
      });
    });

    if (!decorationsRef.current) {
      decorationsRef.current = editorRef.current.createDecorationsCollection(newDecorations);
    } else {
      decorationsRef.current.set(newDecorations);
    }

    cursors.forEach((c) => {
      let widget = widgetsRef.current.get(c.userId);
      if (!widget) {
        widget = new RemoteCursorWidget(c.userId, c.color, c.displayName);
        widgetsRef.current.set(c.userId, widget);
        editorRef.current!.addContentWidget(widget);
      }
      widget.update(c.line, c.column);
      editorRef.current!.layoutContentWidget(widget);
    });

    widgetsRef.current.forEach((widget, userId) => {
      if (!cursors.has(userId)) {
        editorRef.current!.removeContentWidget(widget);
        widgetsRef.current.delete(userId);
      }
    });
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
    /* eslint-disable @typescript-eslint/no-explicit-any */
    ydoc.on('update', (update: Uint8Array, origin: any) => {
      if (origin !== 'server') {
        socket.emit('editor:ydoc-sync', { roomCode, update: update.buffer as ArrayBuffer });
      }
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */

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

    // Request the full server state so this client's Y.Doc is bootstrapped
    // from the authoritative snapshot rather than starting blank.
    socket.emit('editor:request-state', { roomCode });

    // Bind Monaco once editor is ready
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const ytext = ydoc.getText('monaco');
        bindingRef.current = new MonacoBinding(
          ytext,
          model,
          new Set([editorRef.current]),
          null // We can add awareness provider here later
        );
      }
    }

    return () => {
      socket.off('editor:ydoc-sync', onYDocSync);
      socket.off('editor:resync', onResync);
      if (bindingRef.current) bindingRef.current.destroy();
      ydoc.destroy();
    };
  }, [roomCode]); // Setup once per room

  function handleMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;

    const model = editorInstance.getModel();
    if (model) {
      if (ydocRef.current && !bindingRef.current) {
        const ytext = ydocRef.current.getText('monaco');
        bindingRef.current = new MonacoBinding(
          ytext,
          model,
          new Set([editorInstance]),
          null
        );
      }

      model.onDidChangeContent((e: editor.IModelContentChangedEvent) => {
        if (e.isFlush) return;

        if (!canBypassProtection) {
          const isMultiLineDelete = e.changes.some((ch: editor.IModelContentChange) => ch.range.startLineNumber !== ch.range.endLineNumber);
          if (isMultiLineDelete) {
            onViolationRef.current?.('Deleting or modifying multiple lines at once is not allowed.');
            editorInstance.trigger('multiline-guard', 'undo', null);
            return;
          }
        }

        const ranges = protectedRef.current;
        if (ranges && ranges.length > 0) {
          const overlaps = e.changes.some((ch: editor.IModelContentChange) => {
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

    editorInstance.onDidChangeCursorPosition((e: editor.ICursorPositionChangedEvent) => {
      onCursorMove(e.position.lineNumber, e.position.column);
    });
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <MonacoEditor
        height="100%"
        language={language === 'cpp' ? 'cpp' : language}
        theme="vs-dark"
        onMount={handleMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 22,
          tabSize: 2,
          readOnly: finalReadOnly,
          domReadOnly: false,
          contextmenu: true,
          selectionHighlight: true,
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

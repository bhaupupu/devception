'use client';
import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useEditorStore } from '@/store/editorStore';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Props {
  onChange: (value: string) => void;
  onCursorMove: (line: number, column: number) => void;
  language: string;
  readOnly?: boolean;
}

export function CodeEditor({ onChange, onCursorMove, language, readOnly = false }: Props) {
  const { code, cursors } = useEditorStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const widgetsRef = useRef<Map<string, editor.IContentWidget>>(new Map());

  // Inject cursor highlight CSS (background + left border per user color)
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
    styleEl.textContent = css;
  }, [cursors]);

  // Apply decorations + content widgets for remote cursors
  useEffect(() => {
    const editorInstance = editorRef.current;
    const monacoInstance = monacoRef.current;
    if (!editorInstance || !monacoInstance) return;

    const model = editorInstance.getModel();
    if (!model) return;

    // Remove old content widgets
    widgetsRef.current.forEach((w) => editorInstance.removeContentWidget(w));
    widgetsRef.current.clear();

    // Add cursor decorations + name widgets
    const newDecorations = Array.from(cursors.entries()).map(([uid, c]) => {
      const safeId = uid.replace(/[^a-zA-Z0-9]/g, '');

      // Name label widget
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
        options: {
          className: `rcursor-${safeId}`,
          stickiness: 1,
          zIndex: 10,
        },
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

  function handleMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;

    editorInstance.onDidChangeCursorPosition((e) => {
      onCursorMove(e.position.lineNumber, e.position.column);
    });
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <MonacoEditor
        height="100%"
        language={language === 'cpp' ? 'cpp' : language}
        value={code}
        theme="vs-dark"
        onChange={(v) => onChange(v ?? '')}
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

'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AppSocket } from '@/lib/socket';
import type { TaskVerdict } from '@/types/socket';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e1e1e', color: '#555', fontSize: 12, fontFamily: 'monospace' }}>
      Loading editor…
    </div>
  ),
});

interface Props {
  tasks: Task[];
  myUserId: string;
  socket: AppSocket | null;
  roomCode: string;
  language?: string;
}

export function TaskPanel({ tasks, myUserId, socket, roomCode, language = 'javascript' }: Props) {
  const [selected, setSelected] = useState<Task | null>(null);
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<{ passed: boolean; text: string; verdicts: TaskVerdict[]; supported: boolean } | null>(null);
  const [editorReady, setEditorReady] = useState(false);

  const myTasks = tasks.filter((t) => t.assignedTo === myUserId);

  useEffect(() => {
    if (!selected) {
      setEditorReady(false);
      return;
    }
    const t = setTimeout(() => setEditorReady(true), 200);
    return () => clearTimeout(t);
  }, [selected]);

  const openTask = (task: Task) => {
    setSelected(task);
    setCode(task.starterCode ?? '');
    setFeedback(null);
  };

  const closeTask = () => {
    setSelected(null);
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (!selected || !socket) return;
    setFeedback(null);

    socket.once('task:result', ({ taskId, passed, feedback: fb, verdicts, supported }) => {
      if (taskId === selected._id) {
        setFeedback({ passed, text: fb, verdicts: verdicts ?? [], supported: supported ?? true });
        if (passed) setTimeout(() => closeTask(), 1800);
      }
    });

    socket.emit('task:submit', {
      roomCode,
      taskId: selected._id,
      submittedCode: code,
    });
  };

  return (
    <>
      {/* Task list (always visible in right panel) */}
      <div className="h-full flex flex-col game-panel overflow-hidden">
        <div className="p-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            My Tasks
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {myTasks.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
              No tasks assigned yet
            </p>
          )}
          {myTasks.map((task) => (
            <motion.button
              key={task._id}
              whileHover={{ scale: 1.01 }}
              onClick={() => !task.isCompleted && openTask(task)}
              disabled={task.isCompleted}
              className="w-full text-left p-3 rounded-lg transition-all"
              style={{
                background: task.isCompleted ? 'var(--bg-hover)' : 'var(--bg-card)',
                border: '1px solid var(--border)',
                opacity: task.isCompleted ? 0.5 : 1,
                cursor: task.isCompleted ? 'not-allowed' : 'pointer',
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-medium leading-tight">{task.title}</p>
                {task.isCompleted ? (
                  <Badge variant="green">Done</Badge>
                ) : (
                  <Badge variant={task.difficulty === 'hard' ? 'red' : task.difficulty === 'medium' ? 'yellow' : 'blue'}>
                    {task.difficulty}
                  </Badge>
                )}
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{task.type.replace('-', ' ')}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Full-screen task editor modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)' }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="w-full max-w-3xl flex flex-col rounded-xl overflow-hidden"
              style={{
                background: 'var(--bg-card)',
                border: '2px solid var(--border)',
                height: '85vh',
              }}
            >
              {/* Header */}
              <div
                className="flex items-start justify-between gap-4 p-4 border-b flex-shrink-0"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={selected.difficulty === 'hard' ? 'red' : selected.difficulty === 'medium' ? 'yellow' : 'blue'}>
                      {selected.difficulty}
                    </Badge>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {selected.type.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="font-bold text-sm">{selected.title}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{selected.description}</p>
                </div>
                <button
                  onClick={closeTask}
                  className="flex-shrink-0 text-lg leading-none hover:opacity-70"
                  style={{ color: 'var(--text-muted)' }}
                >
                  ✕
                </button>
              </div>

              {/* Monaco editor */}
              <div style={{ flex: 1, minHeight: 0, background: '#1e1e1e' }}>
                {editorReady ? (
                  <MonacoEditor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={(val) => setCode(val ?? '')}
                    theme="vs-dark"
                    onMount={(editor) => {
                      setTimeout(() => editor.layout(), 50);
                      editor.focus();
                    }}
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      tabSize: 2,
                      insertSpaces: true,
                      lineNumbers: 'on',
                      folding: true,
                      automaticLayout: true,
                    }}
                  />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 12, fontFamily: 'monospace' }}>
                    Loading editor…
                  </div>
                )}
              </div>

              {/* Verdicts + footer */}
              <div
                className="flex flex-col gap-2 p-4 flex-shrink-0 border-t"
                style={{ borderColor: 'var(--border)' }}
              >
                <AnimatePresence mode="wait">
                  {feedback && (
                    <motion.div
                      key="feedback"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-1"
                    >
                      <p
                        className="text-xs font-semibold"
                        style={{ color: feedback.passed ? 'var(--accent-green)' : 'var(--accent-red)' }}
                      >
                        {feedback.passed ? '✓ ' : '✗ '}{feedback.text}
                      </p>
                      {feedback.supported && feedback.verdicts.length > 0 && (
                        <div className="max-h-28 overflow-y-auto flex flex-col gap-1 text-[10px] font-mono">
                          {feedback.verdicts.map((v) => (
                            <div
                              key={v.index}
                              className="flex items-start gap-2 px-2 py-1 rounded"
                              style={{
                                background: v.passed ? 'rgba(17,127,45,0.12)' : 'rgba(197,17,17,0.12)',
                                border: `1px solid ${v.passed ? 'rgba(17,127,45,0.35)' : 'rgba(197,17,17,0.35)'}`,
                              }}
                            >
                              <span style={{ color: v.passed ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                {v.passed ? '✓' : '✗'}
                              </span>
                              <div className="flex-1 min-w-0" style={{ color: 'var(--text-secondary)' }}>
                                <div>in: <span style={{ color: 'var(--text-primary)' }}>{v.input}</span></div>
                                <div>
                                  expected: <span style={{ color: 'var(--text-primary)' }}>{v.expected}</span>
                                  {' · '}
                                  got: <span style={{ color: v.passed ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                    {v.error ? `⚠ ${v.error}` : v.actual || '(empty)'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-end gap-2 flex-shrink-0">
                  <button
                    onClick={closeTask}
                    className="pixel-btn pixel-btn-light px-4 py-2"
                    style={{ fontSize: '9px' }}
                  >
                    Cancel
                  </button>
                  <Button size="sm" onClick={handleSubmit}>Submit</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

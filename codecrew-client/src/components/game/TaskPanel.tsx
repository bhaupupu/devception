'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Task } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AppSocket } from '@/lib/socket';
import { useGameStore } from '@/store/gameStore';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Props {
  tasks: Task[];
  myUserId: string;
  socket: AppSocket | null;
  roomCode: string;
}

interface Feedback {
  passed: boolean;
  text: string;
}

function TaskModal({
  task,
  language,
  isImposter,
  socket,
  roomCode,
  onClose,
}: {
  task: Task;
  language: string;
  isImposter: boolean;
  socket: AppSocket | null;
  roomCode: string;
  onClose: () => void;
}) {
  const [code, setCode] = useState(task.starterCode);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Listen for result only while this modal is open
    if (!socket) return;
    const handler = ({ taskId, passed, feedback: fb }: { taskId: string; passed: boolean; feedback: string }) => {
      if (taskId === task._id) {
        setFeedback({ passed, text: fb });
        setSubmitting(false);
        if (passed) setTimeout(onClose, 1200);
      }
    };
    socket.on('task:result', handler);
    return () => { socket.off('task:result', handler); };
  }, [socket, task._id, onClose]);

  const handleSubmit = () => {
    if (!socket) return;
    setFeedback(null);
    setSubmitting(true);
    socket.emit('task:submit', { roomCode, taskId: task._id, submittedCode: code });
  };

  const handleFakeComplete = () => {
    if (!socket) return;
    setSubmitting(true);
    socket.emit('task:fake-complete', { roomCode, taskId: task._id });
    setTimeout(onClose, 600);
  };

  const diffColor = task.difficulty === 'hard' ? 'red' : task.difficulty === 'medium' ? 'yellow' : 'blue';

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-3xl rounded-xl overflow-hidden flex flex-col"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div className="p-4 flex items-start justify-between gap-3 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant={diffColor as 'red' | 'yellow' | 'blue'}>{task.difficulty}</Badge>
              <Badge variant="blue">{task.type.replace('-', ' ')}</Badge>
              {isImposter && (
                <Badge variant="red">IMPOSTER VIEW</Badge>
              )}
            </div>
            <h3 className="font-bold text-base">{task.title}</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{task.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-xl leading-none flex-shrink-0 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-muted)' }}
          >
            ×
          </button>
        </div>

        {/* Test cases hint */}
        {task.testCases.length > 0 && (
          <div className="px-4 py-2 flex-shrink-0" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              Test: {task.testCases[0].input} → <span style={{ color: 'var(--accent-green)' }}>{task.testCases[0].expectedOutput}</span>
            </p>
          </div>
        )}

        {/* Editor area */}
        <div className="flex-1 overflow-hidden" style={{ minHeight: 300 }}>
          {isImposter ? (
            /* Imposters see the code but can't edit it — they fake-complete */
            <div className="h-full relative">
              <MonacoEditor
                height="100%"
                language={language === 'cpp' ? 'cpp' : language}
                value={task.starterCode}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  theme: 'vs-dark',
                  wordWrap: 'on',
                }}
                theme="vs-dark"
              />
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
              >
                <div className="text-center p-6">
                  <p className="text-lg mb-2" style={{ color: 'var(--accent-red)' }}>🕵️ You&apos;re the Imposter</p>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                    Pretend to work, then mark complete to blend in.
                  </p>
                  <button
                    onClick={handleFakeComplete}
                    disabled={submitting}
                    className="pixel-btn pixel-btn-red px-6 py-2"
                    style={{ fontSize: 10 }}
                  >
                    {submitting ? 'COMPLETING...' : 'MARK COMPLETE'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <MonacoEditor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(val) => setCode(val ?? '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                theme: 'vs-dark',
                wordWrap: 'on',
                tabSize: 2,
                insertSpaces: true,
                autoIndent: 'full',
              }}
              theme="vs-dark"
            />
          )}
        </div>

        {/* Footer */}
        {!isImposter && (
          <div className="p-4 flex items-center justify-between gap-3 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
            <AnimatePresence mode="wait">
              {feedback ? (
                <motion.p
                  key="fb"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm"
                  style={{ color: feedback.passed ? 'var(--accent-green)' : 'var(--accent-red)' }}
                >
                  {feedback.passed ? '✓ ' : '✗ '}{feedback.text}
                </motion.p>
              ) : (
                <p key="hint" className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Write your solution, then submit
                </p>
              )}
            </AnimatePresence>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm" onClick={onClose} style={{ background: 'var(--bg-secondary)' }}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Checking...' : 'Submit'}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}

export function TaskPanel({ tasks, myUserId, socket, roomCode }: Props) {
  const [selected, setSelected] = useState<Task | null>(null);
  const { myRole, game } = useGameStore();
  const isImposter = myRole === 'imposter';
  const language = game?.language ?? 'javascript';

  const myTasks = tasks.filter((t) => t.assignedTo === myUserId);
  const completedCount = myTasks.filter((t) => t.isCompleted).length;

  return (
    <div className="h-full flex flex-col game-panel overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {isImposter ? '🕵️ Tasks' : 'My Tasks'}
        </h3>
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {completedCount}/{myTasks.length}
        </span>
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
            onClick={() => !task.isCompleted && setSelected(task)}
            disabled={task.isCompleted}
            className="w-full text-left p-3 rounded-lg transition-all"
            style={{
              background: task.isCompleted ? 'var(--bg-hover)' : 'var(--bg-card)',
              border: '1px solid var(--border)',
              opacity: task.isCompleted ? 0.5 : 1,
              cursor: task.isCompleted ? 'default' : 'pointer',
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
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {task.type.replace('-', ' ')}
              {!task.isCompleted && (
                <span className="ml-2 opacity-60">↗ click to open</span>
              )}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Task modal */}
      <AnimatePresence>
        {selected && (
          <TaskModal
            key={selected._id}
            task={selected}
            language={language}
            isImposter={isImposter}
            socket={socket}
            roomCode={roomCode}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AppSocket } from '@/lib/socket';

interface Props {
  tasks: Task[];
  myUserId: string;
  socket: AppSocket | null;
  roomCode: string;
}

export function TaskPanel({ tasks, myUserId, socket, roomCode }: Props) {
  const [selected, setSelected] = useState<Task | null>(null);
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<{ passed: boolean; text: string } | null>(null);

  const myTasks = tasks.filter((t) => t.assignedTo === myUserId);

  const handleSubmit = () => {
    if (!selected || !socket) return;
    setFeedback(null);

    socket.once('task:result', ({ taskId, passed, feedback: fb }) => {
      if (taskId === selected._id) {
        setFeedback({ passed, text: fb });
        if (passed) setTimeout(() => setSelected(null), 1500);
      }
    });

    socket.emit('task:submit', {
      roomCode,
      taskId: selected._id,
      submittedCode: code,
    });
  };

  return (
    <div className="h-full flex flex-col game-panel overflow-hidden">
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          My Tasks
        </h3>
      </div>

      {!selected ? (
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
              onClick={() => { setSelected(task); setCode(task.starterCode); setFeedback(null); }}
              disabled={task.isCompleted}
              className="w-full text-left p-3 rounded-lg transition-all"
              style={{
                background: task.isCompleted ? 'var(--bg-hover)' : 'var(--bg-card)',
                border: '1px solid var(--border)',
                opacity: task.isCompleted ? 0.5 : 1,
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
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden p-3">
          <button
            onClick={() => setSelected(null)}
            className="text-xs mb-3 flex items-center gap-1 hover:underline"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Back to tasks
          </button>

          <p className="font-bold text-sm mb-1">{selected.title}</p>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{selected.description}</p>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 font-mono text-xs p-3 rounded-lg resize-none mb-3"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              minHeight: 120,
            }}
          />

          <AnimatePresence>
            {feedback && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs mb-2"
                style={{ color: feedback.passed ? 'var(--accent-green)' : 'var(--accent-red)' }}
              >
                {feedback.passed ? '✓ ' : '✗ '}{feedback.text}
              </motion.p>
            )}
          </AnimatePresence>

          <Button size="sm" onClick={handleSubmit}>Submit</Button>
        </div>
      )}
    </div>
  );
}

'use client';
import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { AppSocket } from '@/lib/socket';

interface Props {
  socket: AppSocket | null;
  roomCode: string;
  disabled?: boolean;
}

export function ChatPanel({ socket, roomCode, disabled = false }: Props) {
  const { messages, sendMessage } = useChat(socket, roomCode);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (disabled) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="game-panel flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Chat
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {messages.map((msg) =>
          msg.system ? (
            <div key={msg.messageId} className="text-center">
              <span className="text-[10px] italic" style={{ color: 'var(--text-muted)' }}>
                — {msg.message} —
              </span>
            </div>
          ) : (
            <div key={msg.messageId}>
              <span className="text-xs font-semibold" style={{ color: msg.color }}>
                {msg.displayName}:{' '}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {msg.message}
              </span>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={disabled ? 'Eliminated — spectator' : 'Message...'}
            maxLength={300}
            disabled={disabled}
            className="flex-1 px-3 py-1.5 rounded text-xs"
            style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'not-allowed' : 'text',
            }}
          />
          <button
            onClick={handleSend}
            disabled={disabled}
            className="px-3 py-1.5 rounded text-xs font-semibold"
            style={{
              background: 'var(--accent-blue)',
              color: '#fff',
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

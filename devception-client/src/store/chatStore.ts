import { create } from 'zustand';

export interface ChatMessage {
  messageId: string;
  userId: string;
  displayName: string;
  message: string;
  color: string;
  timestamp: number;
  system?: boolean;
  systemType?: 'leave' | 'join' | 'system';
}

interface ChatStore {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  addSystemMessage: (msg: { type: 'leave' | 'join' | 'system'; message: string; timestamp: number }) => void;
  clear: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  addMessage: (msg) =>
    set((s) => ({
      messages: [...s.messages.slice(-200), msg],
    })),

  addSystemMessage: ({ type, message, timestamp }) =>
    set((s) => ({
      messages: [
        ...s.messages.slice(-200),
        {
          messageId: `system-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
          userId: 'system',
          displayName: 'System',
          message,
          color: 'var(--text-muted)',
          timestamp,
          system: true,
          systemType: type,
        },
      ],
    })),

  clear: () => set({ messages: [] }),
}));

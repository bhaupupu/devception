import { create } from 'zustand';

export interface ChatMessage {
  messageId: string;
  userId: string;
  displayName: string;
  message: string;
  color: string;
  timestamp: number;
}

interface ChatStore {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clear: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  addMessage: (msg) =>
    set((s) => ({
      messages: [...s.messages.slice(-200), msg], // keep last 200
    })),

  clear: () => set({ messages: [] }),
}));

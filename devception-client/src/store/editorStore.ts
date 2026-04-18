import { create } from 'zustand';

interface CursorInfo {
  userId: string;
  displayName: string;
  line: number;
  column: number;
  color: string;
}

interface EditorStore {
  code: string;
  version: number;
  cursors: Map<string, CursorInfo>;
  setCode: (code: string, version: number) => void;
  updateCursor: (cursor: CursorInfo) => void;
  removeCursor: (userId: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  code: '',
  version: 0,
  cursors: new Map(),

  setCode: (code, version) => set({ code, version }),

  updateCursor: (cursor) =>
    set((s) => {
      const next = new Map(s.cursors);
      next.set(cursor.userId, cursor);
      return { cursors: next };
    }),

  removeCursor: (userId) =>
    set((s) => {
      const next = new Map(s.cursors);
      next.delete(userId);
      return { cursors: next };
    }),
}));

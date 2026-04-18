import { create } from 'zustand';
import type { ProtectedRange } from '@/types/game';

interface CursorInfo {
  userId: string;
  displayName: string;
  line: number;
  column: number;
  color: string;
}

interface EditorStore {
  // Authoritative server snapshot (synced on game start, phase-change, and resync).
  // This is the value the Monaco model should be initialized to ONCE per game start.
  // After mount, Monaco is the source of truth — remote ops mutate the model directly
  // via applyEdits() and this `code` field is updated as a mirror for non-editor consumers.
  code: string;
  version: number;
  // Bumped every time a full-state replacement happens (new game, resync). The editor
  // component watches this and calls model.setValue() only when it changes.
  resetNonce: number;
  protectedRanges: ProtectedRange[];
  cursors: Map<string, CursorInfo>;

  setInitialCode: (code: string, version: number, protectedRanges?: ProtectedRange[]) => void;
  setCodeMirror: (code: string, version: number) => void;
  resyncCode: (code: string, version: number) => void;
  updateCursor: (cursor: CursorInfo) => void;
  removeCursor: (userId: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  code: '',
  version: 0,
  resetNonce: 0,
  protectedRanges: [],
  cursors: new Map(),

  setInitialCode: (code, version, protectedRanges) =>
    set((s) => ({
      code,
      version,
      protectedRanges: protectedRanges ?? [],
      resetNonce: s.resetNonce + 1,
    })),

  setCodeMirror: (code, version) => set({ code, version }),

  resyncCode: (code, version) =>
    set((s) => ({
      code,
      version,
      resetNonce: s.resetNonce + 1,
    })),

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

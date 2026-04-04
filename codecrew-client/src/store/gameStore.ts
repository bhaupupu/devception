import { create } from 'zustand';
import { GameState, PlayerState, Task } from '@/types/game';

interface GameStore {
  game: GameState | null;
  myRole: 'good-coder' | 'imposter' | null;
  myColor: string | null;
  isLocked: boolean;
  setGame: (game: GameState) => void;
  setMyRole: (role: 'good-coder' | 'imposter', color: string) => void;
  updatePhase: (phase: GameState['phase']) => void;
  updateTimer: (remainingMs: number) => void;
  updateProgress: (sharedProgress: number) => void;
  addPlayer: (player: Partial<PlayerState> & { userId: string }) => void;
  removePlayer: (userId: string) => void;
  setPlayerReady: (userId: string) => void;
  markPlayerAlive: (userId: string, isAlive: boolean) => void;
  completeTask: (taskId: string, completedBy: string) => void;
  setWinner: (winner: 'good-coders' | 'imposters') => void;
  setLocked: (locked: boolean) => void;
  setSettings: (settings: Partial<GameState['settings']>) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  game: null,
  myRole: null,
  myColor: null,
  isLocked: false,

  setGame: (game) => set({ game }),

  setMyRole: (role, color) => set({ myRole: role, myColor: color }),

  updatePhase: (phase) =>
    set((s) => s.game ? { game: { ...s.game, phase } } : {}),

  updateTimer: (remainingMs) =>
    set((s) => s.game ? { game: { ...s.game, timer: { ...s.game.timer, remainingMs } } } : {}),

  updateProgress: (sharedProgress) =>
    set((s) => s.game ? { game: { ...s.game, sharedProgress } } : {}),

  addPlayer: (player) =>
    set((s) => {
      if (!s.game) return {};
      const exists = s.game.players.find((p) => p.userId === player.userId);
      if (exists) return {};
      return {
        game: {
          ...s.game,
          players: [...s.game.players, player as PlayerState],
        },
      };
    }),

  removePlayer: (userId) =>
    set((s) => {
      if (!s.game) return {};
      return {
        game: {
          ...s.game,
          players: s.game.players.map((p) =>
            p.userId === userId ? { ...p, isConnected: false } : p
          ),
        },
      };
    }),

  setPlayerReady: (userId) =>
    set((s) => {
      if (!s.game) return {};
      return {
        game: {
          ...s.game,
          players: s.game.players.map((p) =>
            p.userId === userId ? { ...p, readyToStart: true } : p
          ),
        },
      };
    }),

  markPlayerAlive: (userId, isAlive) =>
    set((s) => {
      if (!s.game) return {};
      return {
        game: {
          ...s.game,
          players: s.game.players.map((p) =>
            p.userId === userId ? { ...p, isAlive } : p
          ),
        },
      };
    }),

  completeTask: (taskId, completedBy) =>
    set((s) => {
      if (!s.game) return {};
      return {
        game: {
          ...s.game,
          tasks: s.game.tasks.map((t) =>
            t._id === taskId ? { ...t, isCompleted: true, completedBy } : t
          ),
        },
      };
    }),

  setWinner: (winner) =>
    set((s) => s.game ? { game: { ...s.game, winner, phase: 'results' } } : {}),

  setLocked: (locked) => set({ isLocked: locked }),

  setSettings: (settings) =>
    set((s) => s.game ? { game: { ...s.game, settings: { ...s.game.settings, ...settings } } } : {}),

  reset: () => set({ game: null, myRole: null, myColor: null, isLocked: false }),
}));

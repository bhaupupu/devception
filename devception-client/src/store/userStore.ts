import { create } from 'zustand';

interface UserStore {
  userId: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  setUser: (userId: string, displayName: string, avatarUrl: string) => void;
  clear: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: null,
  displayName: null,
  avatarUrl: null,

  setUser: (userId, displayName, avatarUrl) => set({ userId, displayName, avatarUrl }),
  clear: () => set({ userId: null, displayName: null, avatarUrl: null }),
}));

export interface UserProfile {
  _id: string;
  googleId: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLanguages: string[];
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    timesImposter: number;
    tasksCompleted: number;
    bugsInjected: number;
    xp: number;
    level: number;
  };
  cosmetics: {
    selectedSkin: string;
    ownedSkins: string[];
    selectedHat: string;
    ownedHats: string[];
  };
}

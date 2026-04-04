import { create } from 'zustand';

export interface MeetingState {
  meetingId: string;
  calledBy: string;
  calledByName: string;
  phase: 'discussion' | 'voting' | 'results';
  votedPlayers: Set<string>; // userIds who have voted
  myVote: string | null;
  tally: Record<string, number> | null;
  ejected: {
    userId: string;
    displayName: string;
    role: string;
    wasImposter: boolean;
  } | null;
  wasTie: boolean;
}

interface MeetingStore {
  meeting: MeetingState | null;
  startMeeting: (data: { meetingId: string; calledBy: string; calledByName: string }) => void;
  setPhase: (phase: MeetingState['phase']) => void;
  markVoted: (userId: string) => void;
  setMyVote: (targetId: string) => void;
  setResults: (data: {
    tally: Record<string, number>;
    ejected: MeetingState['ejected'];
    wasTie: boolean;
  }) => void;
  endMeeting: () => void;
}

export const useMeetingStore = create<MeetingStore>((set) => ({
  meeting: null,

  startMeeting: ({ meetingId, calledBy, calledByName }) =>
    set({
      meeting: {
        meetingId,
        calledBy,
        calledByName,
        phase: 'discussion',
        votedPlayers: new Set(),
        myVote: null,
        tally: null,
        ejected: null,
        wasTie: false,
      },
    }),

  setPhase: (phase) =>
    set((s) => s.meeting ? { meeting: { ...s.meeting, phase } } : {}),

  markVoted: (userId) =>
    set((s) => {
      if (!s.meeting) return {};
      const next = new Set(s.meeting.votedPlayers);
      next.add(userId);
      return { meeting: { ...s.meeting, votedPlayers: next } };
    }),

  setMyVote: (targetId) =>
    set((s) => s.meeting ? { meeting: { ...s.meeting, myVote: targetId } } : {}),

  setResults: ({ tally, ejected, wasTie }) =>
    set((s) =>
      s.meeting
        ? { meeting: { ...s.meeting, phase: 'results', tally, ejected, wasTie } }
        : {}
    ),

  endMeeting: () => set({ meeting: null }),
}));

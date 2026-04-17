import { getLiveGame } from './game.service';

interface VoteTally {
  [targetId: string]: number;
}

export function tallyVotes(roomCode: string, meetingId: string): {
  ejectedUserId: string | null;
  tally: VoteTally;
  wasTie: boolean;
} {
  const game = getLiveGame(roomCode);
  if (!game) return { ejectedUserId: null, tally: {}, wasTie: false };

  const meeting = game.meetings.find((m) => m._id === meetingId);
  if (!meeting) return { ejectedUserId: null, tally: {}, wasTie: false };

  const tally: VoteTally = {};
  for (const vote of meeting.votes) {
    const t = vote.targetId;
    tally[t] = (tally[t] ?? 0) + 1;
  }

  const entries = Object.entries(tally).filter(([id]) => id !== 'skip');
  if (entries.length === 0) return { ejectedUserId: null, tally, wasTie: false };

  entries.sort((a, b) => b[1] - a[1]);
  const topCount = entries[0][1];
  const topEntries = entries.filter(([, c]) => c === topCount);

  if (topEntries.length > 1) {
    // Tie — no ejection
    return { ejectedUserId: null, tally, wasTie: true };
  }

  return { ejectedUserId: topEntries[0][0], tally, wasTie: false };
}

export function addVote(
  roomCode: string,
  meetingId: string,
  voterId: string,
  targetId: string
): boolean {
  const game = getLiveGame(roomCode);
  if (!game) return false;

  const voter = game.players.find((p) => p.userId === voterId);
  if (!voter?.isAlive) return false;

  const meeting = game.meetings.find((m) => m._id === meetingId);
  if (!meeting) return false;

  const alreadyVoted = meeting.votes.some((v) => v.voterId === voterId);
  if (alreadyVoted) return false;

  meeting.votes.push({ voterId, targetId });
  return true;
}

import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import * as votingService from '../../services/voting.service';
import { env } from '../../config/env';
import { randomUUID } from 'crypto';

const MEETING_COOLDOWN_MS = 60000;
const lastMeetingTime = new Map<string, number>();

// Stores active voting timeouts so they can be cancelled early when all players vote
const votingTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function registerMeetingHandlers(io: Server, socket: AuthenticatedSocket): void {
  socket.on('meeting:call', ({ roomCode }: { roomCode: string }) => {
    const game = gameService.getLiveGame(roomCode);
    if (!game) return;
    if (game.phase !== 'in-progress') return;

    const player = game.players.find((p) => p.userId === socket.userId);
    if (!player || !player.isAlive) return;

    const lastAt = lastMeetingTime.get(roomCode) ?? 0;
    const cooldownRemaining = MEETING_COOLDOWN_MS - (Date.now() - lastAt);
    if (cooldownRemaining > 0) {
      socket.emit('meeting:cooldown', { remainingMs: cooldownRemaining });
      return;
    }

    lastMeetingTime.set(roomCode, Date.now());

    // Use per-room settings if set, otherwise fall back to env defaults
    const discussionMs = game.settings?.discussionTimeMs ?? env.MEETING_DISCUSSION_MS;
    const votingMs = game.settings?.votingTimeMs ?? env.MEETING_VOTING_MS;

    const meetingId = randomUUID();
    const meeting = {
      _id: meetingId,
      calledBy: socket.userId,
      calledAt: new Date(),
      phase: 'discussion' as const,
      discussionDurationMs: discussionMs,
      votingDurationMs: votingMs,
      votes: [],
      ejectedPlayer: null,
      wasImposter: null,
    };

    game.meetings.push(meeting);
    gameService.setGamePhase(roomCode, 'meeting');

    io.to(roomCode).emit('meeting:start', {
      meetingId,
      calledBy: socket.userId,
      calledByName: socket.displayName,
      phase: 'discussion',
      cooldownMs: MEETING_COOLDOWN_MS,
      discussionMs,
      votingMs,
    });

    // Discussion → voting
    setTimeout(() => {
      const currentGame = gameService.getLiveGame(roomCode);
      if (!currentGame || currentGame.phase !== 'meeting') return;

      gameService.setGamePhase(roomCode, 'voting');
      io.to(roomCode).emit('meeting:phase-change', { meetingId, phase: 'voting' });

      // Schedule results — cancelled early if all players vote
      const timer = setTimeout(() => {
        votingTimers.delete(meetingId);
        resolveVoting(io, roomCode, meetingId);
      }, votingMs);

      votingTimers.set(meetingId, timer);
    }, discussionMs);
  });

  socket.on(
    'meeting:vote',
    ({ roomCode, meetingId, targetId }: { roomCode: string; meetingId: string; targetId: string }) => {
      const added = votingService.addVote(roomCode, meetingId, socket.userId, targetId);
      if (!added) return;

      io.to(roomCode).emit('meeting:vote-cast', { voterId: socket.userId, hasVoted: true });

      // End voting early if every alive player has now voted
      const g = gameService.getLiveGame(roomCode);
      if (g && g.phase === 'voting') {
        const mtg = g.meetings.find((m) => m._id === meetingId);
        if (mtg) {
          const alivePlayers = g.players.filter((p) => p.isAlive);
          if (mtg.votes.length >= alivePlayers.length) {
            const timer = votingTimers.get(meetingId);
            if (timer !== undefined) {
              clearTimeout(timer);
              votingTimers.delete(meetingId);
            }
            // 500 ms so clients can render the final vote-cast before results arrive
            setTimeout(() => resolveVoting(io, roomCode, meetingId), 500);
          }
        }
      }
    }
  );
}

async function resolveVoting(io: Server, roomCode: string, meetingId: string): Promise<void> {
  const g = gameService.getLiveGame(roomCode);
  if (!g) return;

  const { ejectedUserId, tally, wasTie } = votingService.tallyVotes(roomCode, meetingId);

  let winner: 'good-coders' | 'imposters' | null = null;
  let gameOver = false;
  let ejectedInfo: { userId: string; displayName: string; role: string; wasImposter: boolean } | null = null;

  if (ejectedUserId && !wasTie) {
    const ejected = gameService.ejectPlayer(roomCode, ejectedUserId);
    gameOver = ejected.gameOver;
    winner = ejected.winner;

    if (ejected.ejected) {
      const ejectedPlayer = ejected.ejected;
      ejectedInfo = {
        userId: ejectedUserId,
        displayName: ejectedPlayer.displayName,
        role: ejectedPlayer.role,
        wasImposter: ejectedPlayer.role === 'imposter',
      };

      const mtg = g.meetings.find((m) => m._id === meetingId);
      if (mtg) {
        mtg.ejectedPlayer = ejectedUserId;
        mtg.wasImposter = ejectedPlayer.role === 'imposter';
      }
    }
  }

  io.to(roomCode).emit('meeting:results', { meetingId, tally, ejected: ejectedInfo, wasTie });

  setTimeout(async () => {
    if (gameOver && winner) {
      try { await gameService.endGame(roomCode, winner); } catch (err) { console.error('endGame error:', err); }
      io.to(roomCode).emit('game:end', { winner });
    } else {
      gameService.setGamePhase(roomCode, 'in-progress');
      io.to(roomCode).emit('game:phase-change', { phase: 'in-progress' });
      io.to(roomCode).emit('meeting:end', { meetingId });
    }
  }, 5000);
}

import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import * as votingService from '../../services/voting.service';
import { env } from '../../config/env';
import { v4 as uuidv4 } from 'uuid';

const MEETING_COOLDOWN_MS = 60000; // 1 minute between emergency meetings per room
const lastMeetingTime = new Map<string, number>(); // roomCode -> timestamp

export function registerMeetingHandlers(io: Server, socket: AuthenticatedSocket): void {
  socket.on('meeting:call', ({ roomCode }: { roomCode: string }) => {
    const game = gameService.getLiveGame(roomCode);
    if (!game) return;
    if (game.phase !== 'in-progress') return;

    const player = game.players.find((p) => p.userId === socket.userId);
    if (!player || !player.isAlive) return;

    // Enforce 1-minute cooldown between meetings
    const lastAt = lastMeetingTime.get(roomCode) ?? 0;
    const cooldownRemaining = MEETING_COOLDOWN_MS - (Date.now() - lastAt);
    if (cooldownRemaining > 0) {
      socket.emit('meeting:cooldown', { remainingMs: cooldownRemaining });
      return;
    }

    lastMeetingTime.set(roomCode, Date.now());

    const meetingId = uuidv4();
    const meeting = {
      _id: meetingId,
      calledBy: socket.userId,
      calledAt: new Date(),
      phase: 'discussion' as const,
      discussionDurationMs: env.MEETING_DISCUSSION_MS,
      votingDurationMs: env.MEETING_VOTING_MS,
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
    });

    // Discussion → voting
    setTimeout(() => {
      const currentGame = gameService.getLiveGame(roomCode);
      if (!currentGame || currentGame.phase !== 'meeting') return;

      gameService.setGamePhase(roomCode, 'voting');
      io.to(roomCode).emit('meeting:phase-change', { meetingId, phase: 'voting' });

      // Voting → results
      setTimeout(() => {
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
            await gameService.endGame(roomCode, winner);
            io.to(roomCode).emit('game:end', { winner });
          } else {
            gameService.setGamePhase(roomCode, 'in-progress');
            io.to(roomCode).emit('game:phase-change', { phase: 'in-progress' });
            io.to(roomCode).emit('meeting:end', { meetingId });
          }
        }, 5000);
      }, env.MEETING_VOTING_MS);
    }, env.MEETING_DISCUSSION_MS);
  });

  socket.on(
    'meeting:vote',
    ({ roomCode, meetingId, targetId }: { roomCode: string; meetingId: string; targetId: string }) => {
      const added = votingService.addVote(roomCode, meetingId, socket.userId, targetId);
      if (added) {
        io.to(roomCode).emit('meeting:vote-cast', { voterId: socket.userId, hasVoted: true });
      }
    }
  );
}

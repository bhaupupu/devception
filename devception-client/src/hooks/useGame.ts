'use client';
import { useEffect } from 'react';
import { AppSocket } from '@/lib/socket';
import { useGameStore } from '@/store/gameStore';
import { useEditorStore } from '@/store/editorStore';
import { useChatStore } from '@/store/chatStore';
import { useMeetingStore } from '@/store/meetingStore';

export function useGameEvents(socket: AppSocket | null, roomCode: string) {
  const gameStore = useGameStore();
  const editorStore = useEditorStore();
  const chatStore = useChatStore();
  const meetingStore = useMeetingStore();

  useEffect(() => {
    if (!socket || !roomCode) return;

    socket.emit('room:join', { roomCode });

    // Room events
    socket.on('room:state', (game) => {
      gameStore.setGame(game);
      editorStore.setInitialCode(game.sharedCode, game.editorVersion, game.protectedRanges ?? []);
    });
    socket.on('room:player-joined', gameStore.addPlayer);
    socket.on('room:player-left', ({ userId }) => gameStore.removePlayer(userId));
    socket.on('room:ready-update', ({ userId }) => gameStore.setPlayerReady(userId));
    socket.on('room:settings-updated', ({ settings }) => gameStore.setSettings(settings));

    // Game events
    socket.on('game:role-reveal', ({ role, color }) =>
      gameStore.setMyRole(role as 'good-coder' | 'imposter', color)
    );
    socket.on('game:phase-change', ({ phase, game }) => {
      gameStore.updatePhase(phase as Parameters<typeof gameStore.updatePhase>[0]);
      if (game) {
        gameStore.setGame(game);
        if (game.sharedCode) {
          editorStore.setInitialCode(game.sharedCode, game.editorVersion, game.protectedRanges ?? []);
        }
      }
    });
    socket.on('game:timer-tick', ({ remainingMs }) => gameStore.updateTimer(remainingMs));
    socket.on('game:end', ({ winner }) => {
      gameStore.setWinner(winner);
      gameStore.updatePhase('results');
      meetingStore.endMeeting();
    });

    // Editor events — op-apply and resync are handled inside CodeEditor.tsx where the
    // Monaco model is owned. Here we only wire the incidental events.
    socket.on('editor:cursor-update', (cursor) => editorStore.updateCursor(cursor));
    socket.on('editor:test-results', ({ testCases }) => gameStore.updateTestCases(testCases));
    socket.on('editor:protected-violation', ({ message }) => {
      chatStore.addSystemMessage({ type: 'system', message: `🔒 ${message}`, timestamp: Date.now() });
    });

    // Task events
    socket.on('task:completed', ({ taskId, completedBy, sharedProgress }) => {
      gameStore.completeTask(taskId, completedBy);
      gameStore.updateProgress(sharedProgress);
    });
    socket.on('task:progress-update', ({ sharedProgress }) => {
      gameStore.updateProgress(sharedProgress);
    });

    // Imposter effects
    socket.on('imposter:keyboard-locked', ({ durationMs }: { durationMs: number }) => {
      gameStore.setLocked(true);
      setTimeout(() => gameStore.setLocked(false), durationMs);
    });

    // Chat events
    socket.on('chat:message', (msg) => chatStore.addMessage(msg));
    socket.on('chat:clear', () => chatStore.clear());
    socket.on('chat:system', (msg) => chatStore.addSystemMessage(msg));

    // Meeting events
    socket.on('meeting:start', ({ meetingId, calledBy, calledByName, discussionMs, votingMs }) => {
      meetingStore.startMeeting({
        meetingId, calledBy, calledByName,
        discussionMs: discussionMs ?? 60000,
        votingMs: votingMs ?? 30000,
      });
      gameStore.updatePhase('meeting');
    });
    socket.on('meeting:phase-change', ({ phase }) => {
      meetingStore.setPhase(phase as 'discussion' | 'voting' | 'results');
      if (phase === 'voting') gameStore.updatePhase('voting');
    });
    socket.on('meeting:vote-cast', ({ voterId }) => meetingStore.markVoted(voterId));
    socket.on('meeting:results', ({ tally, ejected, wasTie }) => {
      meetingStore.setResults({ tally, ejected, wasTie });
      if (ejected) gameStore.markPlayerAlive(ejected.userId, false);
    });
    socket.on('meeting:end', () => {
      meetingStore.endMeeting();
      gameStore.updatePhase('in-progress');
    });

    return () => {
      socket.off('room:state');
      socket.off('room:player-joined');
      socket.off('room:player-left');
      socket.off('room:ready-update');
      socket.off('room:settings-updated');
      socket.off('game:role-reveal');
      socket.off('game:phase-change');
      socket.off('game:timer-tick');
      socket.off('game:end');
      socket.off('editor:cursor-update');
      socket.off('editor:test-results');
      socket.off('editor:protected-violation');
      socket.off('task:completed');
      socket.off('task:progress-update');
      socket.off('imposter:keyboard-locked');
      socket.off('chat:message');
      socket.off('chat:clear');
      socket.off('chat:system');
      socket.off('meeting:start');
      socket.off('meeting:phase-change');
      socket.off('meeting:vote-cast');
      socket.off('meeting:results');
      socket.off('meeting:end');
    };
  }, [socket, roomCode]);
}

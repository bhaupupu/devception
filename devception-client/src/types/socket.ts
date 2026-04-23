import { GameState, PlayerState } from './game';

export interface EditorOp {
  rangeOffset: number;
  rangeLength: number;
  text: string;
}

export interface TaskVerdict {
  index: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

export interface ServerToClientEvents {
  'room:state': (game: GameState) => void;
  'room:player-joined': (player: Partial<PlayerState> & { userId: string }) => void;
  'room:player-left': (data: { userId: string }) => void;
  'room:player-disconnected': (data: { userId: string }) => void;
  'room:ready-update': (data: { userId: string; readyToStart: boolean }) => void;
  'room:error': (data: { message: string }) => void;
  'room:settings-updated': (data: { settings: { imposterCount: number; tasksPerPlayer: number; impostorCooldownMs: number; discussionTimeMs: number; votingTimeMs: number } }) => void;

  'game:start': (data: { phase: string }) => void;
  'game:role-reveal': (data: { role: string; color: string }) => void;
  'game:phase-change': (data: { phase: string; timestamp?: number; game?: GameState }) => void;
  'game:timer-tick': (data: { remainingMs: number }) => void;
  'game:end': (data: { winner: 'good-coders' | 'imposters' }) => void;

  'editor:op-apply': (data: { userId: string; ops: EditorOp[]; version: number }) => void;
  'editor:resync': (data: { fullContent: string; version: number }) => void;
  'editor:protected-violation': (data: { reason: 'protected-violation' | 'min-length'; violationName: string; message: string }) => void;
  'editor:cursor-update': (data: { userId: string; line: number; column: number; color: string; displayName: string }) => void;
  'editor:test-results': (data: { testCases: { id: string; description: string; passed: boolean }[] }) => void;

  'task:result': (data: { taskId: string; passed: boolean; feedback: string; verdicts: TaskVerdict[]; supported: boolean }) => void;
  'task:completed': (data: { taskId: string; completedBy: string; completedByName: string; sharedProgress: number }) => void;
  'task:progress-update': (data: { sharedProgress: number }) => void;

  'imposter:bug-injected': (data: { affectedLine: number }) => void;
  'imposter:screen-blurred': (data: { durationMs: number }) => void;
  'imposter:hint-received': (data: { hintText: string; sender: string }) => void;
  'imposter:cooldown-update': (data: { action: string; remainingMs: number; startCooldown?: boolean; cooldownMs?: number }) => void;
  'imposter:keyboard-locked': (data: { durationMs: number }) => void;

  'meeting:start': (data: { meetingId: string; calledBy: string; calledByName: string; phase: string; discussionMs: number; votingMs: number }) => void;
  'meeting:vote-cast': (data: { voterId: string; hasVoted: boolean }) => void;
  'meeting:phase-change': (data: { meetingId: string; phase: string }) => void;
  'meeting:results': (data: { meetingId: string; tally: Record<string, number>; ejected: { userId: string; displayName: string; role: string; wasImposter: boolean } | null; wasTie: boolean }) => void;
  'meeting:end': (data: { meetingId: string; phase: string }) => void;

  'chat:message': (data: { messageId: string; userId: string; displayName: string; message: string; color: string; timestamp: number }) => void;
  'chat:system': (data: { type: 'leave' | 'join' | 'system'; message: string; timestamp: number }) => void;
  'chat:clear': (data: { reason: string }) => void;
  'chat:error': (data: { message: string }) => void;

  'session:force-logout': (data: { reason: string; message: string }) => void;
}

export interface ClientToServerEvents {
  'room:join': (data: { roomCode: string }) => void;
  'room:leave': (data: { roomCode: string }) => void;
  'room:player-ready': (data: { roomCode: string }) => void;
  'room:force-start': (data: { roomCode: string }) => void;
  'room:update-settings': (data: { roomCode: string; settings: Partial<{ imposterCount: number; tasksPerPlayer: number; impostorCooldownMs: number; discussionTimeMs: number; votingTimeMs: number }> }) => void;
  'room:reset': (data: { roomCode: string }) => void;

  'editor:op': (data: { roomCode: string; ops: EditorOp[]; baseVersion: number }) => void;
  'editor:cursor-move': (data: { roomCode: string; line: number; column: number }) => void;

  'task:submit': (data: { roomCode: string; taskId: string; submittedCode: string }) => void;

  'imposter:inject-bug': (data: { roomCode: string; targetLine: number; bugCode: string }) => void;
  'imposter:blur-screen': (data: { roomCode: string; targetUserId: string }) => void;
  'imposter:send-hint': (data: { roomCode: string; hintText: string }) => void;
  'imposter:lock-keyboard': (data: { roomCode: string; targetUserId: string }) => void;

  'meeting:call': (data: { roomCode: string }) => void;
  'meeting:vote': (data: { roomCode: string; meetingId: string; targetId: string }) => void;

  'chat:send': (data: { roomCode: string; message: string }) => void;
}

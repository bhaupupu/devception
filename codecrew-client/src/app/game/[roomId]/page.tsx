'use client';
import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useGameEvents } from '@/hooks/useGame';
import { useEditor } from '@/hooks/useEditor';
import { useVoting } from '@/hooks/useVoting';
import { useGameStore } from '@/store/gameStore';
import { useMeetingStore } from '@/store/meetingStore';

import { RoleReveal } from '@/components/game/RoleReveal';
import { CodeEditor } from '@/components/game/CodeEditor';
import { TaskPanel } from '@/components/game/TaskPanel';
import { PlayerList } from '@/components/game/PlayerList';
import { SharedProgress } from '@/components/game/SharedProgress';
import { ChatPanel } from '@/components/game/ChatPanel';
import { EmergencyButton } from '@/components/game/EmergencyButton';
import { ImposterActions } from '@/components/game/ImposterActions';
import { ScreenBlurOverlay } from '@/components/game/ScreenBlurOverlay';
import { MeetingModal } from '@/components/meeting/MeetingModal';
import { GameOverScreen } from '@/components/game/GameOverScreen';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Props {
  params: { roomId: string };
}

export default function GamePage({ params }: Props) {
  const { roomId } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const socket = useSocket();
  const { game, myRole, isLocked, reset } = useGameStore();
  const { meeting } = useMeetingStore();
  const [showRoleReveal, setShowRoleReveal] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);

  useGameEvents(socket, roomId);
  const { handleChange, handleCursorMove } = useEditor(socket, roomId);
  const { callMeeting } = useVoting(socket, roomId);

  const userId = (session?.user as { id?: string })?.id ?? '';

  const handleRoleRevealDone = useCallback(() => setShowRoleReveal(false), []);

  // Show role reveal when phase transitions
  useEffect(() => {
    if (game?.phase === 'role-reveal') setShowRoleReveal(true);
  }, [game?.phase]);

  const handlePlayAgain = useCallback(() => {
    reset();
    router.push(`/lobby/${roomId}`);
  }, [reset, router, roomId]);

  const onCursorMove = useCallback(
    (line: number, column: number) => {
      setCurrentLine(line - 1);
      handleCursorMove(line, column);
    },
    [handleCursorMove]
  );

  if (!game) {
    return (
      <div className="pixel-bg min-h-screen flex items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="pixel-bg h-screen flex flex-col overflow-hidden">
      {/* Role reveal overlay */}
      {showRoleReveal && <RoleReveal onDone={handleRoleRevealDone} />}

      {/* Screen blur / keyboard lock overlay */}
      <ScreenBlurOverlay socket={socket} myRole={myRole} />

      {/* Meeting modal */}
      <MeetingModal socket={socket} roomCode={roomId} myUserId={userId} />

      {/* Game over screen — shown as overlay when phase is results */}
      {game.phase === 'results' && (
        <GameOverScreen
          game={game}
          myUserId={userId}
          myRole={myRole}
          socket={socket}
          onPlayAgain={handlePlayAgain}
        />
      )}

      {/* Top HUD */}
      <div className="px-3 py-2 flex-shrink-0">
        <SharedProgress game={game} myRole={myRole} />
      </div>

      {/* Main game layout */}
      <div className="flex-1 flex gap-2 px-2 pb-2 min-h-0">
        {/* Left: Player list */}
        <div className="w-44 flex-shrink-0">
          <PlayerList players={game.players} myUserId={userId} />
        </div>

        {/* Center: Code editor */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-mono px-2 py-1 rounded"
              style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              {game.language}
            </span>
            <div className="flex-1" />
            <EmergencyButton onCall={callMeeting} disabled={!!meeting} />
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0">
            <CodeEditor
              onChange={handleChange}
              onCursorMove={onCursorMove}
              language={game.language}
              readOnly={isLocked}
            />
          </div>
        </div>

        {/* Right: Task panel + imposter actions + chat */}
        <div className="w-60 flex-shrink-0 flex flex-col gap-2">
          {/* Imposter actions (only shown to imposters) */}
          {myRole === 'imposter' && (
            <ImposterActions
              socket={socket}
              roomCode={roomId}
              players={game.players}
              myUserId={userId}
              currentLine={currentLine}
            />
          )}

          {/* Task panel */}
          <div className="flex-1 min-h-0">
            <TaskPanel
              tasks={game.tasks}
              myUserId={userId}
              socket={socket}
              roomCode={roomId}
            />
          </div>

          {/* Chat */}
          <div className="h-48 flex-shrink-0">
            <ChatPanel socket={socket} roomCode={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
}

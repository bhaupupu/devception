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
import { useChatStore } from '@/store/chatStore';

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

type MobileTab = 'editor' | 'tasks' | 'chat' | 'players';

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
  const [showResults, setShowResults] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [mobileTab, setMobileTab] = useState<MobileTab>('editor');

  useGameEvents(socket, roomId);
  const { emitOps, handleCursorMove } = useEditor(socket, roomId);
  const { callMeeting } = useVoting(socket, roomId);
  const addSystemMessage = useChatStore((s) => s.addSystemMessage);

  // Graceful disconnect on tab close / navigation:
  //  1. Tell the server we left so it can broadcast "<name> left" to other players.
  //  2. Fire a sendBeacon signout so NextAuth clears the session (auto-logout).
  useEffect(() => {
    if (!socket || !roomId) return;
    const handleBeforeUnload = () => {
      try {
        socket.emit('room:leave', { roomCode: roomId });
      } catch { /* socket may already be closing */ }
      try {
        const url = '/api/auth/leave-signout';
        const blob = new Blob([JSON.stringify({ roomCode: roomId })], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } catch { /* beacon unsupported — NextAuth will expire on next load */ }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [socket, roomId]);

  // Show a local toast-style system message when the server rejects a protected-region edit.
  const onProtectedViolation = useCallback(
    (message: string) => addSystemMessage({ type: 'system', message: `🔒 ${message}`, timestamp: Date.now() }),
    [addSystemMessage]
  );

  const userId = (session?.user as { id?: string })?.id ?? '';
  const me = game?.players.find((p) => p.userId === userId);
  const canEdit = !!me?.isAlive;

  const handleRoleRevealDone = useCallback(() => setShowRoleReveal(false), []);

  useEffect(() => {
    if (game?.phase === 'role-reveal') setShowRoleReveal(true);
    if (game?.phase === 'results') setShowResults(true);
  }, [game?.phase]);

  const handlePlayAgain = useCallback(() => {
    setShowResults(false);
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

  const mobileTabs: { key: MobileTab; label: string }[] = [
    { key: 'editor', label: 'CODE' },
    { key: 'tasks', label: 'TASKS' },
    { key: 'chat', label: 'CHAT' },
    { key: 'players', label: 'CREW' },
  ];

  return (
    <div className="pixel-bg h-screen flex flex-col overflow-hidden">
      {/* Overlays */}
      {showRoleReveal && <RoleReveal onDone={handleRoleRevealDone} />}
      <ScreenBlurOverlay socket={socket} myRole={myRole} />
      <MeetingModal socket={socket} roomCode={roomId} myUserId={userId} />
      {showResults && (
        <GameOverScreen
          game={game}
          myUserId={userId}
          myRole={myRole}
          socket={socket}
          onPlayAgain={handlePlayAgain}
        />
      )}

      {/* Top HUD */}
      <div className="px-2 md:px-3 py-2 flex-shrink-0">
        <SharedProgress game={game} myRole={myRole} />
      </div>

      {/* ── DESKTOP layout (md+) ── */}
      <div className="hidden md:flex flex-1 gap-2 px-2 pb-2 min-h-0">
        {/* Left: Player list */}
        <div className="w-44 flex-shrink-0">
          <PlayerList players={game.players} myUserId={userId} testCases={game.mainTestCases ?? []} />
        </div>

        {/* Center: Code editor */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-mono px-2 py-1 rounded"
              style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              {game.language}
            </span>
            <div className="flex-1" />
            <EmergencyButton onCall={callMeeting} disabled={!!meeting} />
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor
              onOps={emitOps}
              onCursorMove={onCursorMove}
              language={game.language}
              readOnly={isLocked || !canEdit}
              onProtectedViolation={onProtectedViolation}
            />
          </div>
        </div>

        {/* Right: Task panel + imposter actions + chat */}
        <div className="w-60 flex-shrink-0 flex flex-col gap-2">
          {myRole === 'imposter' && (
            <ImposterActions
              socket={socket}
              roomCode={roomId}
              players={game.players}
              myUserId={userId}
              currentLine={currentLine}
            />
          )}
          <div className="flex-1 min-h-0">
            <TaskPanel tasks={game.tasks} myUserId={userId} socket={socket} roomCode={roomId} language={game.language} />
          </div>
          <div className="h-48 flex-shrink-0">
            <ChatPanel socket={socket} roomCode={roomId} disabled={!canEdit} />
          </div>
        </div>
      </div>

      {/* ── MOBILE layout ── */}
      <div className="flex md:hidden flex-1 flex-col min-h-0">
        {/* Mobile tab content */}
        <div className="flex-1 min-h-0 px-2">
          {mobileTab === 'editor' && (
            <div className="h-full flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                <span className="text-xs font-mono px-2 py-1 rounded"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  {game.language}
                </span>
                <div className="flex-1" />
                <EmergencyButton onCall={callMeeting} disabled={!!meeting} />
              </div>
              <div className="flex-1 min-h-0">
                <CodeEditor
                  onOps={emitOps}
                  onCursorMove={onCursorMove}
                  language={game.language}
                  readOnly={isLocked || !canEdit}
                  onProtectedViolation={onProtectedViolation}
                />
              </div>
            </div>
          )}

          {mobileTab === 'tasks' && (
            <div className="h-full flex flex-col gap-2 pt-1">
              {myRole === 'imposter' && (
                <ImposterActions
                  socket={socket}
                  roomCode={roomId}
                  players={game.players}
                  myUserId={userId}
                  currentLine={currentLine}
                />
              )}
              <div className="flex-1 min-h-0">
                <TaskPanel tasks={game.tasks} myUserId={userId} socket={socket} roomCode={roomId} language={game.language} />
              </div>
            </div>
          )}

          {mobileTab === 'chat' && (
            <div className="h-full pt-1">
              <ChatPanel socket={socket} roomCode={roomId} disabled={!canEdit} />
            </div>
          )}

          {mobileTab === 'players' && (
            <div className="h-full pt-1">
              <PlayerList players={game.players} myUserId={userId} testCases={game.mainTestCases ?? []} />
            </div>
          )}
        </div>

        {/* Mobile tab bar */}
        <div className="flex-shrink-0 flex border-t-[3px] border-[#1c1917]"
          style={{ background: '#faf8f4' }}>
          {mobileTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMobileTab(key)}
              className="flex-1 py-3"
              style={{
                fontFamily: 'Press Start 2P, monospace',
                fontSize: '8px',
                color: mobileTab === key ? 'var(--accent-blue)' : 'var(--text-muted)',
                background: mobileTab === key ? '#e8f0ff' : 'transparent',
                borderBottom: mobileTab === key ? '3px solid var(--accent-blue)' : '3px solid transparent',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

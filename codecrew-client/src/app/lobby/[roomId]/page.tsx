'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { WaitingRoom } from '@/components/lobby/WaitingRoom';
import { useSocket } from '@/hooks/useSocket';
import { useGameStore } from '@/store/gameStore';
import { useGameEvents } from '@/hooks/useGame';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Props {
  params: { roomId: string };
}

export default function WaitingRoomPage({ params }: Props) {
  const { roomId } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const socket = useSocket();
  const { game } = useGameStore();
  const [isReady, setIsReady] = useState(false);

  useGameEvents(socket, roomId);

  const userId = (session?.user as { id?: string })?.id ?? '';

  // Navigate to game when phase changes
  useEffect(() => {
    if (game?.phase === 'role-reveal' || game?.phase === 'in-progress') {
      router.push(`/game/${roomId}`);
    }
  }, [game?.phase, roomId, router]);

  const handleReady = () => {
    setIsReady(true);
    socket?.emit('room:player-ready', { roomCode: roomId });
  };

  const handleForceStart = () => {
    socket?.emit('room:force-start', { roomCode: roomId });
  };

  const handleSettingsChange = (key: string, value: number) => {
    socket?.emit('room:update-settings', { roomCode: roomId, settings: { [key]: value } });
  };

  // First player in the list is admin
  const isAdmin = !!game && game.players.length > 0 &&
    game.players[0].userId === userId;

  if (!game) {
    return (
      <div className="pixel-bg min-h-screen flex items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  return (
    <main className="pixel-bg min-h-screen flex items-center justify-center p-6">
      <WaitingRoom
        game={game}
        myUserId={userId}
        onReady={handleReady}
        onForceStart={handleForceStart}
        onSettingsChange={handleSettingsChange}
        isReady={isReady}
        isAdmin={isAdmin}
      />
    </main>
  );
}

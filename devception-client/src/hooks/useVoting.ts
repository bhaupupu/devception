'use client';
import { useCallback } from 'react';
import { AppSocket } from '@/lib/socket';
import { useMeetingStore } from '@/store/meetingStore';

export function useVoting(socket: AppSocket | null, roomCode: string) {
  const { meeting, setMyVote } = useMeetingStore();

  const castVote = useCallback(
    (targetId: string) => {
      if (!meeting || meeting.myVote) return;
      setMyVote(targetId);
      socket?.emit('meeting:vote', {
        roomCode,
        meetingId: meeting.meetingId,
        targetId,
      });
    },
    [socket, roomCode, meeting, setMyVote]
  );

  const callMeeting = useCallback(() => {
    socket?.emit('meeting:call', { roomCode });
  }, [socket, roomCode]);

  return { meeting, castVote, callMeeting };
}

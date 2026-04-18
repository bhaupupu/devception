'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeetingStore } from '@/store/meetingStore';
import { useGameStore } from '@/store/gameStore';
import { VotingCard } from './VotingCard';
import { VoteResults } from './VoteResults';
import { ChatPanel } from '@/components/game/ChatPanel';
import { AppSocket } from '@/lib/socket';

interface Props {
  socket: AppSocket | null;
  roomCode: string;
  myUserId: string;
}

export function MeetingModal({ socket, roomCode, myUserId }: Props) {
  const { meeting, setMyVote } = useMeetingStore();
  const { game } = useGameStore();
  const [discussionTime, setDiscussionTime] = useState(0);
  const [votingTime, setVotingTime] = useState(0);

  useEffect(() => {
    if (!meeting) return;
    let t: ReturnType<typeof setInterval>;

    if (meeting.phase === 'discussion') {
      const secs = Math.round(meeting.discussionMs / 1000);
      setDiscussionTime(secs);
      t = setInterval(() => setDiscussionTime((s) => Math.max(0, s - 1)), 1000);
    } else if (meeting.phase === 'voting') {
      const secs = Math.round(meeting.votingMs / 1000);
      setVotingTime(secs);
      t = setInterval(() => setVotingTime((s) => Math.max(0, s - 1)), 1000);
    }

    return () => clearInterval(t);
  }, [meeting?.phase, meeting?.discussionMs, meeting?.votingMs]);

  const me = game?.players.find((p) => p.userId === myUserId);
  const canAct = !!me?.isAlive;

  const handleVote = (targetId: string) => {
    if (!meeting || meeting.myVote || !canAct) return;
    setMyVote(targetId);
    socket?.emit('meeting:vote', { roomCode, meetingId: meeting.meetingId, targetId });
  };

  const alivePlayers = game?.players.filter((p) => p.isAlive) ?? [];

  return (
    <AnimatePresence>
      {meeting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            className="game-panel max-w-2xl w-full flex flex-col"
            style={{ border: '1px solid #ef4444', height: '90vh' }}
          >
            {/* Header */}
            <div className="p-6 border-b text-center flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
              <p className="text-4xl mb-2">🚨</p>
              <h2 className="text-2xl font-black" style={{ color: '#ef4444' }}>EMERGENCY MEETING</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Called by <strong>{meeting.calledByName}</strong>
              </p>

              {meeting.phase === 'discussion' && (
                <div className="mt-3">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Discussion</p>
                  <p className="text-2xl font-bold font-mono" style={{ color: discussionTime < 15 ? '#ef4444' : 'var(--text-primary)' }}>
                    {discussionTime}s
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Discuss who the imposter might be. Voting starts soon.
                  </p>
                </div>
              )}

              {meeting.phase === 'voting' && (
                <div className="mt-3">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Voting</p>
                  <p className="text-2xl font-bold font-mono" style={{ color: votingTime < 10 ? '#ef4444' : 'var(--accent-blue)' }}>
                    {votingTime}s
                  </p>
                </div>
              )}
            </div>

            {/* Content — voting (scrolls) */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              {!canAct && meeting.phase !== 'results' && (
                <div
                  className="mb-4 text-center text-xs font-semibold py-2 rounded"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)' }}
                >
                  Spectating — you were eliminated. You cannot vote or chat.
                </div>
              )}
              {meeting.phase === 'results' ? (
                <VoteResults
                  ejected={meeting.ejected}
                  tally={meeting.tally ?? {}}
                  wasTie={meeting.wasTie}
                  players={alivePlayers}
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {alivePlayers.map((p) => (
                    <VotingCard
                      key={p.userId}
                      player={p}
                      isMe={p.userId === myUserId}
                      hasVoted={meeting.votedPlayers.has(p.userId)}
                      myVote={meeting.myVote}
                      onVote={canAct && meeting.phase === 'voting' ? handleVote : undefined}
                    />
                  ))}
                  {meeting.phase === 'voting' && (
                    <VotingCard
                      player={null}
                      isMe={false}
                      hasVoted={false}
                      myVote={meeting.myVote}
                      onVote={canAct ? handleVote : undefined}
                      isSkip
                    />
                  )}
                </div>
              )}
            </div>

            {/* Chat panel — available throughout the meeting */}
            {meeting.phase !== 'results' && (
              <div className="flex-shrink-0 border-t" style={{ borderColor: 'var(--border)', height: '200px' }}>
                <ChatPanel socket={socket} roomCode={roomCode} disabled={!canAct} />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

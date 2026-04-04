'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeetingStore } from '@/store/meetingStore';
import { useGameStore } from '@/store/gameStore';
import { VotingCard } from './VotingCard';
import { VoteResults } from './VoteResults';
import { AppSocket } from '@/lib/socket';

interface Props {
  socket: AppSocket | null;
  roomCode: string;
  myUserId: string;
}

export function MeetingModal({ socket, roomCode, myUserId }: Props) {
  const { meeting, setMyVote } = useMeetingStore();
  const { game } = useGameStore();
  const [discussionTime, setDiscussionTime] = useState(60);
  const [votingTime, setVotingTime] = useState(30);

  useEffect(() => {
    if (!meeting) return;
    let t: ReturnType<typeof setInterval>;

    if (meeting.phase === 'discussion') {
      setDiscussionTime(60);
      t = setInterval(() => setDiscussionTime((s) => Math.max(0, s - 1)), 1000);
    } else if (meeting.phase === 'voting') {
      setVotingTime(30);
      t = setInterval(() => setVotingTime((s) => Math.max(0, s - 1)), 1000);
    }

    return () => clearInterval(t);
  }, [meeting?.phase]);

  const handleVote = (targetId: string) => {
    if (!meeting || meeting.myVote) return;
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
            className="game-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ border: '1px solid #ef4444' }}
          >
            {/* Header */}
            <div className="p-6 border-b text-center" style={{ borderColor: 'var(--border)' }}>
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

            {/* Content */}
            <div className="p-6">
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
                      onVote={meeting.phase === 'voting' ? handleVote : undefined}
                    />
                  ))}
                  {meeting.phase === 'voting' && (
                    <VotingCard
                      player={null}
                      isMe={false}
                      hasVoted={false}
                      myVote={meeting.myVote}
                      onVote={handleVote}
                      isSkip
                    />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

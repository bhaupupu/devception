'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';
import { UserProfile } from '@/types/user';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const token = (session as { accessToken?: string })?.accessToken;
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!token) return;
    api.get<UserProfile>('/users/me', token).then(setUser).catch(console.error);
  }, [token]);

  if (!user) {
    return (
      <div className="pixel-bg min-h-screen flex items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  const xpForNextLevel = user.stats.level * 500;
  const xpProgress = Math.min(100, (user.stats.xp % xpForNextLevel) / xpForNextLevel * 100);

  return (
    <main className="pixel-bg min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="text-sm mb-6 flex items-center gap-1 hover:underline"
          style={{ color: 'var(--text-muted)' }}>
          ← Back
        </button>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="game-panel p-6 mb-6 flex items-center gap-5"
        >
          <Avatar src={user.avatarUrl} name={user.displayName} size="lg" />
          <div className="flex-1">
            <h1 className="text-2xl font-black">{user.displayName}</h1>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
            <div className="flex gap-2">
              <Badge variant="blue">{user.skillLevel}</Badge>
              {user.preferredLanguages.map((lang) => (
                <Badge key={lang} variant="gray">{lang}</Badge>
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black gradient-text">Lv {user.stats.level}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.stats.xp} XP</p>
          </div>
        </motion.div>

        {/* XP bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="game-panel p-4 mb-6"
        >
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>Level Progress</span>
            <span>{user.stats.xp % xpForNextLevel} / {xpForNextLevel} XP</span>
          </div>
          <ProgressBar value={xpProgress} color="linear-gradient(90deg, #4f8ef7, #8b5cf6)" height={12} />
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {[
            { label: 'Games Played', value: user.stats.gamesPlayed, icon: '🎮' },
            { label: 'Games Won', value: user.stats.gamesWon, icon: '🏆' },
            { label: 'Times Imposter', value: user.stats.timesImposter, icon: '😈' },
            { label: 'Tasks Done', value: user.stats.tasksCompleted, icon: '✅' },
            { label: 'Bugs Injected', value: user.stats.bugsInjected, icon: '🐛' },
            {
              label: 'Win Rate',
              value: user.stats.gamesPlayed > 0
                ? `${Math.round((user.stats.gamesWon / user.stats.gamesPlayed) * 100)}%`
                : '0%',
              icon: '📊',
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="game-panel p-4 text-center"
            >
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

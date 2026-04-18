'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';

const SHOP_ITEMS = [
  { id: 'skin-neon', name: 'Neon Coder', category: 'Skin', price: 500, icon: '🟢', owned: false },
  { id: 'skin-hacker', name: 'Dark Hacker', category: 'Skin', price: 750, icon: '💻', owned: false },
  { id: 'hat-crown', name: 'Gold Crown', category: 'Hat', price: 1000, icon: '👑', owned: false },
  { id: 'hat-headphones', name: 'Headphones', category: 'Hat', price: 300, icon: '🎧', owned: true },
  { id: 'theme-matrix', name: 'Matrix Theme', category: 'Theme', price: 500, icon: '🌐', owned: false },
  { id: 'theme-retro', name: 'Retro Terminal', category: 'Theme', price: 400, icon: '📟', owned: false },
  { id: 'effect-trail', name: 'Cursor Trail', category: 'Effect', price: 800, icon: '✨', owned: false },
  { id: 'effect-confetti', name: 'Win Confetti', category: 'Effect', price: 600, icon: '🎉', owned: false },
];

export default function ShopPage() {
  const router = useRouter();

  return (
    <main className="pixel-bg min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="text-sm mb-6 flex items-center gap-1 hover:underline"
          style={{ color: 'var(--text-muted)' }}>
          ← Back
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black gradient-text">Shop</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Customize your Devception experience
            </p>
          </div>
          <div className="game-panel px-4 py-2">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Your balance</p>
            <p className="font-bold text-lg" style={{ color: '#eab308' }}>0 Coins</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SHOP_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="game-panel p-4 text-center"
            >
              <p className="text-4xl mb-3">{item.icon}</p>
              <p className="font-semibold text-sm mb-1">{item.name}</p>
              <Badge variant="gray" className="mb-3">{item.category}</Badge>
              {item.owned ? (
                <div className="w-full py-1.5 rounded text-xs font-semibold"
                  style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid #22c55e' }}>
                  Owned
                </div>
              ) : (
                <div className="w-full py-1.5 rounded text-xs font-semibold opacity-50 cursor-not-allowed"
                  style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  🪙 {item.price} — Coming Soon
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm mt-10" style={{ color: 'var(--text-muted)' }}>
          Earn coins by winning games. Shop functionality coming soon!
        </p>
      </div>
    </main>
  );
}

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export function DirectJoinModal() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        displayName: name.trim(),
        redirect: false,
      });
      
      if (res?.ok) {
        window.location.reload();
      } else {
        console.error('Join failed', res?.error);
        setLoading(false);
      }
    } catch (err) {
      console.error('Join failed', err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
      <div className="game-panel p-6 max-w-sm w-full bg-white text-center flex flex-col gap-4" style={{ background: '#faf8f4' }}>
        <h2 className="pixel-font text-xl mb-2" style={{ color: 'var(--text-primary)' }}>JOIN ROOM</h2>
        <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
          Enter a display name to join immediately:
        </p>
        <form onSubmit={handleJoin} className="flex flex-col gap-3">
          <input
            type="text"
            className="w-full text-center py-3 font-mono text-lg border-2 border-[#1c1917] outline-none focus:border-blue-500"
            style={{ background: '#fff' }}
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={15}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="pixel-btn pixel-btn-blue w-full py-3 mt-2"
            disabled={loading || !name.trim()}
          >
            {loading ? 'JOINING...' : '▶ PLAY NOW'}
          </button>
        </form>
      </div>
    </div>
  );
}

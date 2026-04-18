'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const COOLDOWN_MS = 60000;

interface Props {
  onCall: () => void;
  disabled?: boolean;
}

export function EmergencyButton({ onCall, disabled }: Props) {
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Count down the local cooldown every second
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const t = setTimeout(() => setCooldownRemaining((c) => Math.max(0, c - 1000)), 1000);
    return () => clearTimeout(t);
  }, [cooldownRemaining]);

  const onCooldown = cooldownRemaining > 0;
  const isDisabled = onCooldown || !!disabled;
  const secsLeft = Math.ceil(cooldownRemaining / 1000);

  const handle = () => {
    if (isDisabled) return;
    onCall();
    setCooldownRemaining(COOLDOWN_MS);
  };

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      onClick={handle}
      disabled={isDisabled}
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all"
      style={{
        background: isDisabled ? 'var(--bg-hover)' : 'rgba(239,68,68,0.2)',
        border: `1px solid ${isDisabled ? 'var(--border)' : '#ef4444'}`,
        color: isDisabled ? 'var(--text-muted)' : '#ef4444',
      }}
    >
      🚨 {onCooldown ? `Meeting (${secsLeft}s)` : 'Emergency Meeting'}
    </motion.button>
  );
}

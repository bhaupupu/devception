interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export function ProgressBar({ value, color = '#4f8ef7', height = 8, showLabel = false }: ProgressBarProps) {
  return (
    <div className="w-full flex items-center gap-2">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height, background: 'var(--border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, value)}%`, background: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)', minWidth: 36 }}>
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}

import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'red' | 'green' | 'yellow' | 'gray';
  className?: string;
}

export function Badge({ children, variant = 'blue', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold',
        {
          'bg-blue-500/20 text-blue-400': variant === 'blue',
          'bg-red-500/20 text-red-400': variant === 'red',
          'bg-green-500/20 text-green-400': variant === 'green',
          'bg-yellow-500/20 text-yellow-400': variant === 'yellow',
          'bg-gray-500/20 text-gray-400': variant === 'gray',
        },
        className
      )}
    >
      {children}
    </span>
  );
}

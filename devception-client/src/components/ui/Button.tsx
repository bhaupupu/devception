import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 active:scale-95': variant === 'primary',
          'text-white hover:opacity-80 active:scale-95': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700 active:scale-95': variant === 'danger',
          'hover:bg-white/5 active:scale-95': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      style={
        variant === 'secondary'
          ? { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }
          : undefined
      }
      {...props}
    >
      {children}
    </button>
  );
}

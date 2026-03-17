import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonProps } from './types';

const variantStyles = {
  primary: 'bg-primary text-text-inverse hover:bg-primary-hover',
  secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-hover',
  danger: 'bg-expense text-text-inverse hover:bg-red-700',
  ghost: 'text-text-primary hover:bg-surface-hover',
};

const sizeStyles = {
  sm: 'h-8  px-3 text-sm  gap-1.5',
  md: 'h-10 px-4 text-base gap-2',
  lg: 'h-12 px-6 text-lg  gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

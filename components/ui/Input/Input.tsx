import { cn } from '@/lib/utils';
import { InputProps } from './types';

export function Input({
  label,
  helperText,
  error,
  success,
  leftAddon,
  rightAddon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftAddon && <span className="absolute left-3 text-text-secondary">{leftAddon}</span>}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-default border bg-transparent px-2 py-2 text-base text-text-primary',
            'placeholder:text-text-muted border-gray-300',
            'focus:ring-0 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed transition duration-100 ease-in-out',
            error && 'border-expense focus:ring-expense',
            success && 'border-income focus:ring-income',
            !error && !success && 'border-border',
            leftAddon && 'pl-1',
            rightAddon && 'pr-1',
            className
          )}
          {...props}
        />
        {rightAddon && <span className="absolute right-3 text-text-secondary">{rightAddon}</span>}
      </div>
      {helperText && (
        <p className={cn('text-xs', error ? 'text-expense' : 'text-text-secondary')}>
          {helperText}
        </p>
      )}
    </div>
  );
}

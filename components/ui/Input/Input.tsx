import { cn } from '@/lib/classes';
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
        <label htmlFor={inputId} className="text-sm font-medium text-content-primary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftAddon && <span className="absolute left-3 text-content-secondary">{leftAddon}</span>}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-default border bg-transparent px-2 py-2 text-base text-content-primary',
            'placeholder:text-content-secondary',
            'focus:ring-0 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed transition duration-100 ease-in-out',
            className
          )}
          {...props}
        />
        {rightAddon && (
          <span className="absolute right-3 text-content-secondary">{rightAddon}</span>
        )}
      </div>
      {helperText && (
        <p className={cn('text-xs', error ? 'text-expense' : 'text-content-secondary')}>
          {helperText}
        </p>
      )}
    </div>
  );
}

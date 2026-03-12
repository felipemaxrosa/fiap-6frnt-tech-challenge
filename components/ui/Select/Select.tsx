import { cn } from '../../../lib/classes';
import type { SelectProps } from './ISelect';

export function Select({
  options,
  placeholder,
  label,
  helperText,
  error,
  disabled,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          disabled={disabled}
          className={cn(
            'w-full appearance-none rounded-lg border bg-white px-3 py-2',
            'text-sm text-gray-900 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-teal-600/50 focus:border-teal-600',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400' : 'border-gray-300',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {helperText && (
        <p className={cn('text-xs', error ? 'text-red-600' : 'text-gray-500')}>{helperText}</p>
      )}
    </div>
  );
}

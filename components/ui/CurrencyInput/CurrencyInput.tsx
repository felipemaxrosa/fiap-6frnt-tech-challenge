'use client';

import { cn } from '../../../lib/classes';
import type { CurrencyInputProps } from './ICurrencyInput';
import { formatCurrency } from '../../../lib/format';
import { useEffect, useState } from 'react';

export function CurrencyInput({
  value = 0,
  onValueChange,
  currency = 'R$',
  label,
  helperText,
  error,
  disabled,
  className,
  id,
  ...props
}: CurrencyInputProps) {
  const [cents, setCents] = useState(Math.round(value * 100));

  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    setCents(Math.round(value * 100));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '');

    const newCents = Number(digits || '0');

    setCents(newCents);
    onValueChange?.(newCents / 100);
  }

  const formatted = formatCurrency(cents / 100);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={cn(
          'flex rounded-lg border overflow-hidden transition-colors',
          'focus-within:ring-2 focus-within:ring-teal-600/50 focus-within:border-teal-600',
          error
            ? 'border-red-400 focus-within:ring-red-400/50 focus-within:border-red-400'
            : 'border-gray-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500 border-r border-gray-300 select-none">
          {currency}
        </span>

        <input
          id={inputId}
          inputMode="numeric"
          disabled={disabled}
          value={formatted}
          onChange={handleChange}
          className={cn(
            'flex-1 px-3 py-2 text-sm text-gray-900 bg-white',
            'focus:outline-none',
            'disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
      </div>

      {helperText && (
        <p className={cn('text-xs', error ? 'text-red-600' : 'text-gray-500')}>{helperText}</p>
      )}
    </div>
  );
}

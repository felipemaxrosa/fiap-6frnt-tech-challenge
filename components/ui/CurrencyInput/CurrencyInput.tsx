'use client';

import { cn } from '../../../lib/classes';
import type { CurrencyInputProps } from './ICurrencyInput';
import { formatCurrency } from '../../../lib/format';
import { useEffect, useId, useState } from 'react';

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
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const [cents, setCents] = useState(Math.round(value * 100));

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

  const borderColor = error
    ? 'border-[var(--color-feedback-danger)]'
    : 'border-[var(--color-brand-primary)]';

  return (
    <div className="flex flex-col gap-[var(--spacing-sm)]">
      {label && (
        <label htmlFor={inputId} className="label-semibold text-[var(--color-content-secondary)]">
          {label}
        </label>
      )}

      <div
        className={cn(
          'flex rounded-[var(--radius-default)] border overflow-hidden',
          borderColor,
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'flex items-center px-[var(--spacing-lg)] py-[var(--spacing-md)]',
            'body-default text-[var(--color-content-secondary)]',
            'bg-[var(--color-background)] border-r',
            borderColor,
            'select-none'
          )}
        >
          {currency}
        </span>

        <input
          id={inputId}
          inputMode="numeric"
          disabled={disabled}
          value={formatted}
          onChange={handleChange}
          style={{ outline: 'none' }}
          className={cn(
            'flex-1 px-[var(--spacing-lg)] py-[var(--spacing-md)]',
            'body-default text-[var(--color-content-primary)]',
            'bg-[var(--color-surface)]',
            'focus:ring-0',
            'disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
      </div>

      {helperText && (
        <p
          className={cn(
            'label-default',
            error ? 'text-[var(--color-feedback-danger)]' : 'text-[var(--color-content-secondary)]'
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

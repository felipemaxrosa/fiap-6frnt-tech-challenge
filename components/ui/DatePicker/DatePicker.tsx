'use client';

import { getInputBorderColor } from '@/lib/input';
import { cn } from '../../../lib/classes';
import type { DatePickerProps } from './IDatePicker';
import { forwardRef, useId, useState } from 'react';

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, helperText, error, disabled, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const [focused, setFocused] = useState(false);

    return (
      <div className="flex flex-col gap-[var(--spacing-sm)]">
        {label && (
          <label htmlFor={inputId} className="label-semibold text-[var(--color-content-secondary)]">
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type="date"
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          style={{ outline: 'none' }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            'w-full rounded-[var(--radius-default)] border bg-[var(--color-surface)]',
            'px-[var(--spacing-lg)] py-[var(--spacing-md)]',
            'body-default text-[var(--color-content-primary)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            getInputBorderColor(focused, error),
            className
          )}
          {...props}
        />

        {helperText && (
          <p
            id={helperId}
            className={cn(
              'label-default',
              error
                ? 'text-[var(--color-feedback-danger)]'
                : 'text-[var(--color-content-secondary)]'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

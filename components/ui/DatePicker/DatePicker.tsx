'use client';

import { cn } from '@/lib/classes';
import { getInputBorderColor } from '@/lib/input';
import { HelperText } from '@/components/ui/HelperText';
import { Label } from '@/components/ui/Label';
import type { DatePickerProps } from './IDatePicker';
import { forwardRef, useId } from 'react';

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, helperText, error, disabled, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className="flex flex-col gap-sm">
        {label && <Label htmlFor={inputId}>{label}</Label>}

        <input
          ref={ref}
          id={inputId}
          type="date"
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          style={{ outline: 'none' }}
          className={cn(
            'w-full rounded-default border bg-surface [outline:none]',
            'px-lg py-md',
            'body-default text-content-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            getInputBorderColor(error),
            className
          )}
          {...props}
        />

        {helperText && (
          <HelperText id={helperId} error={error}>
            {helperText}
          </HelperText>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

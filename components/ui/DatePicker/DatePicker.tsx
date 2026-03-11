'use client';

import { Calendar } from 'lucide-react';
import { cn } from '../../../lib/classes';
import { forwardRef, useId, useRef, type InputHTMLAttributes } from 'react';

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: boolean;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, helperText, error, disabled, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const internalRef = useRef<HTMLInputElement>(null);

    function setRefs(node: HTMLInputElement | null) {
      internalRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    }

    function openPicker() {
      internalRef.current?.showPicker?.();
      internalRef.current?.focus();
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <button
            type="button"
            onClick={openPicker}
            disabled={disabled}
            className="absolute left-3 text-gray-400"
            aria-label="Open calendar"
          >
            <Calendar size={16} />
          </button>

          <input
            ref={setRefs}
            id={inputId}
            type="date"
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={helperId}
            className={cn(
              'w-full rounded-lg border bg-white pl-9 pr-3 py-2',
              'text-sm text-gray-900 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-teal-600/50 focus:border-teal-600',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
                : 'border-gray-300',
              className
            )}
            {...props}
          />
        </div>

        {helperText && (
          <p id={helperId} className={cn('text-xs', error ? 'text-red-600' : 'text-gray-500')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

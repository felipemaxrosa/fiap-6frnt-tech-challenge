import { getInputBorderColor } from '@/lib/input';
import { cn } from '../../../lib/classes';
import type { SelectProps } from './ISelect';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useId } from 'react';

export function Select({
  options,
  placeholder,
  label,
  helperText,
  error,
  disabled,
  className,
  id,
  value,
  onChange,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = value ?? '';
  const selectedLabel = options.find((o) => o.value === selected)?.label;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue: string) => {
    setOpen(false);
    onChange?.(optValue);
  };

  const borderColor = getInputBorderColor(error, { active: open });

  const iconColor = error ? 'var(--color-feedback-danger)' : 'var(--color-brand-primary)';

  return (
    <div className="flex flex-col gap-[var(--spacing-sm)]">
      {label && (
        <label htmlFor={selectId} className="label-semibold text-[var(--color-content-secondary)]">
          {label}
        </label>
      )}

      <div ref={containerRef} className="relative">
        <button
          id={selectId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          style={{ outline: 'none' }}
          className={cn(
            'w-full flex items-center justify-between',
            'bg-[var(--color-surface)]',
            'rounded-default border',
            borderColor,
            'px-[var(--spacing-lg)] py-[var(--spacing-md)]',
            'body-default',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        >
          <span
            className={cn(
              selected ? 'text-[var(--color-content-primary)]' : 'text-[var(--color-placeholder)]'
            )}
          >
            {selectedLabel ?? placeholder ?? ''}
          </span>

          <ChevronDown
            style={{
              width: 24,
              height: 24,
              color: iconColor,
              strokeWidth: 2,
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className={cn(
              'absolute z-50 w-full mt-1',
              'bg-[var(--color-surface)]',
              'rounded-[var(--radius-default)] border',
              borderColor,
              'overflow-hidden',
              'shadow-[var(--shadow-card)]'
            )}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={selected === opt.value}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  'flex items-center px-[var(--spacing-lg)] py-[var(--spacing-md)]',
                  'body-default text-[var(--color-content-primary)]',
                  'cursor-pointer transition-colors',
                  selected === opt.value
                    ? 'bg-[var(--color-badge-transfer-bg)] text-[var(--color-brand-primary)]'
                    : 'hover:bg-[var(--color-badge-transfer-bg)]'
                )}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
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

import { getInputBorderColor } from '@/lib/input';
import { cn } from '@/lib/classes';
import { HelperText } from '@/components/ui/HelperText';
import { Label } from '@/components/ui/Label';
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

  const iconClass = error ? 'text-feedback-danger' : 'text-brand-primary';

  return (
    <div className="flex flex-col gap-sm">
      {label && <Label htmlFor={selectId}>{label}</Label>}

      <div ref={containerRef} className="relative">
        <button
          id={selectId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            'w-full flex items-center justify-between [outline:none]',
            'bg-surface rounded-default border',
            borderColor,
            'px-lg py-md',
            'body-default',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        >
          <span className={cn(selected ? 'text-content-primary' : 'text-placeholder')}>
            {selectedLabel ?? placeholder ?? ''}
          </span>

          <ChevronDown
            size={24}
            strokeWidth={2}
            className={cn(
              iconClass,
              'transition-transform duration-200',
              open ? 'rotate-180' : 'rotate-0'
            )}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className={cn(
              'absolute z-50 w-full mt-1',
              'bg-surface rounded-default border',
              borderColor,
              'overflow-hidden shadow-card'
            )}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={selected === opt.value}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  'flex items-center px-lg py-md',
                  'body-default text-content-primary',
                  'cursor-pointer transition-colors',
                  selected === opt.value
                    ? 'bg-badge-transfer-bg text-brand-primary'
                    : 'hover:bg-badge-transfer-bg'
                )}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {helperText && <HelperText error={error}>{helperText}</HelperText>}
    </div>
  );
}

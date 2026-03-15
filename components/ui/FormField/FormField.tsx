import { cn } from '../../../lib/classes';
import type { FormFieldProps } from './IFormField';

export function FormField({
  label,
  htmlFor,
  helperText,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  const message = error ?? helperText;

  return (
    <div className={cn('flex flex-col gap-[var(--spacing-sm)]', className)}>
      <label htmlFor={htmlFor} className="label-semibold text-[var(--color-content-secondary)]">
        {label}
        {required && (
          <span
            className="ml-[var(--spacing-xs)] text-[var(--color-feedback-danger)]"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      {children}

      {message && (
        <p
          id={`${htmlFor}-description`}
          className={cn(
            'label-default',
            error ? 'text-[var(--color-feedback-danger)]' : 'text-[var(--color-content-secondary)]'
          )}
          role={error ? 'alert' : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
}

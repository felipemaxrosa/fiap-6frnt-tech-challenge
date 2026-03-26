import { cn } from '../../../lib/classes';
import { Label } from '@/components/ui/Label';
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
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>

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

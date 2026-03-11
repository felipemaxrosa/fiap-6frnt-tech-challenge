import { cn } from '../../../lib/classes';

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

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
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {message && (
        <p
          id={`${htmlFor}-description`}
          className={cn('text-xs', error ? 'text-red-600' : 'text-gray-500')}
          role={error ? 'alert' : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
}

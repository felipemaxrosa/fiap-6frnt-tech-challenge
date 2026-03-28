import { cn } from '@/lib/classes';
import { getInputBorderColor } from '@/lib/input';
import { HelperText } from '@/components/ui/HelperText';
import { Label } from '@/components/ui/Label';
import { InputProps } from './types';

export function Input({
  label,
  helperText,
  error,
  leftAddon,
  rightAddon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div className="relative flex items-center">
        {leftAddon && <span className="absolute left-3 text-content-secondary">{leftAddon}</span>}
        <input
          id={inputId}
          style={{ outline: 'none' }}
          className={cn(
            'w-full rounded-default border bg-transparent px-lg py-md text-base text-content-primary',
            'placeholder:text-content-secondary',
            'focus-visible:outline-none focus:ring-0',
            'disabled:opacity-50 disabled:cursor-not-allowed transition duration-100 ease-in-out',
            getInputBorderColor(error),
            className
          )}
          {...props}
        />
        {rightAddon && (
          <span className="absolute right-3 text-content-secondary">{rightAddon}</span>
        )}
      </div>
      {helperText && <HelperText error={error}>{helperText}</HelperText>}
    </div>
  );
}

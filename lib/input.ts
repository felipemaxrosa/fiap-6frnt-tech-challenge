/**
 * @param error Whether the input has an error
 * @param focusVariant Use 'focus-within' for wrapper elements, 'open' for JS-driven open state (e.g. Select), defaults to 'focus' for inputs
 * @returns The appropriate border color classes for the input
 */
export function getInputBorderColor(
  error?: boolean,
  focusVariant: 'focus' | 'focus-within' | 'open' = 'focus',
  open?: boolean
) {
  if (error) return 'border-[var(--color-feedback-danger)]';
  if (focusVariant === 'open') {
    return open ? 'border-[var(--color-brand-primary)]' : 'border-[var(--color-border)]';
  }
  return `border-[var(--color-border)] ${focusVariant}:border-[var(--color-brand-primary)]`;
}

/**
 * @param open Whether the input is currently focused or active
 * @param error Whether the input has an error
 * @returns The appropriate border color class for the input
 */
export function getInputBorderColor(open: boolean, error?: boolean) {
  if (error) return 'border-[var(--color-feedback-danger)]';
  if (open) return 'border-[var(--color-brand-primary)]';
  return 'border-[var(--color-border)]';
}

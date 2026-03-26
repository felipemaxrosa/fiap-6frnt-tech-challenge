type FocusConfig = { variant?: 'focus' | 'focus-within' } | { active: boolean };

/**
 * Returns border color classes for input-like elements.
 *
 * CSS-driven (default): `getInputBorderColor(error)`
 * CSS focus-within:     `getInputBorderColor(error, { variant: 'focus-within' })`
 * JS-driven open state: `getInputBorderColor(error, { active: open })`
 */
export function getInputBorderColor(error?: boolean, config: FocusConfig = {}): string {
  if (error) return 'border-[var(--color-feedback-danger)]';
  if ('active' in config) {
    return config.active ? 'border-[var(--color-brand-primary)]' : 'border-[var(--color-border)]';
  }
  const variant = config.variant ?? 'focus';
  return `border-[var(--color-border)] ${variant}:border-[var(--color-brand-primary)]`;
}

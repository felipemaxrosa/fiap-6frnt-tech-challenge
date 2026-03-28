# Day 43-45: Accessibility (a11y)

## Goal

Bring the app to WCAG 2.1 AA compliance across all interactive surfaces: modals, forms, navigation, and page structure.

---

## Audit Summary

| Priority | Area                                               | Files                                                          |
| -------- | -------------------------------------------------- | -------------------------------------------------------------- |
| HIGH     | Focus trap + focus restoration in modals           | `Modal.tsx`, `FeedbackModal.tsx`                               |
| HIGH     | Keyboard navigation in `Select`                    | `Select.tsx`                                                   |
| HIGH     | `aria-invalid` + `aria-describedby` on form inputs | `Input.tsx`, `CurrencyInput.tsx`                               |
| MEDIUM   | Page structure: `<section>`, heading hierarchy     | `app/page.tsx`, `app/transactions/page.tsx`, `BalanceCard.tsx` |
| MEDIUM   | Tooltip keyboard / AT fallback                     | `Tooltip.tsx`, `TransactionItem.tsx`                           |
| LOW      | `FeedbackModal` close button text                  | `FeedbackModal.tsx`                                            |

---

## Execution Order

| Day    | Tasks                                                                            |
| ------ | -------------------------------------------------------------------------------- |
| **43** | Task 1 — Modal focus trap · Task 3 — Input/CurrencyInput aria                    |
| **44** | Task 2 — Select keyboard nav · Task 4 — Page structure                           |
| **45** | Task 5 — Tooltip fallback · Task 6 — FeedbackModal button · keyboard walkthrough |

---

## Task 1 — Focus Trap + Restoration in Modals

**WCAG:** 2.1.2 No Keyboard Trap, 2.4.3 Focus Order

**Problem:** When a modal opens, focus stays on whatever triggered it. Tab can escape to background content. When the modal closes, focus is lost (goes to `<body>`).

**Files:** `components/ui/Modal/Modal.tsx`, `components/ui/FeedbackModal/FeedbackModal.tsx`

> These are two separate components. The fix must be applied to both independently.

### How it works

1. Save `document.activeElement` into a ref **before** the modal mounts.
2. On mount, move focus to the first focusable element inside the modal panel (or the close button).
3. Intercept `Tab` / `Shift+Tab` to keep focus cycling within the modal.
4. On close (unmount), call `.focus()` on the saved element.

The Escape key is already wired via `document.addEventListener('keydown', ...)` in both components — no change needed there.

---

### `components/ui/Modal/Modal.tsx` — full replacement

```tsx
'use client';

import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/classes';
import type { ModalProps } from './IModal';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    // Save the element that had focus before the modal opened
    previouslyFocused.current = document.activeElement as HTMLElement;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Move focus into the modal on the next frame (after portal renders)
    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = focusable[0];
      if (first) first.focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      // Restore focus when the modal closes
      previouslyFocused.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-content-primary/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          'relative z-10 w-full max-w-[30rem] rounded-default bg-surface p-lg shadow-card',
          className
        )}
      >
        <div className="flex items-center justify-between mb-md">
          {title && (
            <h2 id="modal-title" className="heading text-content-primary">
              {title}
            </h2>
          )}
          {showCloseButton && (
            <button
              onClick={onClose}
              aria-label="Fechar modal"
              className="ml-auto rounded-default p-xs text-icon-default hover:bg-background transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
}
```

**Changes from original:**

- Added `useRef` import.
- Added `panelRef` on the panel `<div>` — used to scope the focusable query.
- Added `previouslyFocused` ref — captures `document.activeElement` when the modal opens.
- `handleKeyDown` now also handles `Tab` / `Shift+Tab` to trap focus.
- `useEffect` uses `requestAnimationFrame` to focus the first element after the portal renders.
- Cleanup restores focus to `previouslyFocused.current`.

---

### `components/ui/FeedbackModal/FeedbackModal.tsx` — full replacement

`FeedbackModal` is a separate component (does not use `Modal`). Apply the same pattern.

```tsx
'use client';

import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { FeedbackModalProps, FeedbackType } from './IFeedbackModal';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const config: Record<FeedbackType, { icon: React.ReactNode; iconClass: string }> = {
  success: {
    icon: <CheckCircle size={48} aria-hidden="true" />,
    iconClass: 'text-feedback-success',
  },
  error: {
    icon: <XCircle size={48} aria-hidden="true" />,
    iconClass: 'text-feedback-danger',
  },
  info: {
    icon: <Info size={48} aria-hidden="true" />,
    iconClass: 'text-brand-primary',
  },
};

const closeLabel: Record<FeedbackType, string> = {
  success: 'Fechar',
  error: 'Entendido',
  info: 'OK',
};

export function FeedbackModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  showCloseButton = true,
}: FeedbackModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = focusable[0];
      if (first) first.focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const { icon, iconClass } = config[type];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-content-primary/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-[22rem] rounded-default bg-surface p-xl shadow-card flex flex-col items-center gap-sm text-center"
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-sm right-sm rounded-default p-xs text-icon-default hover:bg-background transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className={iconClass}>{icon}</div>

        <h2 id="feedback-modal-title" className="heading text-content-primary">
          {title}
        </h2>

        {message && <p className="body-default text-content-secondary">{message}</p>}

        <button
          onClick={onClose}
          className="mt-sm w-full rounded-default bg-brand-primary py-sm body-semibold text-content-inverse hover:opacity-90 transition-opacity"
        >
          {closeLabel[type]}
        </button>
      </div>
    </div>,
    document.body
  );
}
```

**Changes from original:**

- Same focus trap + restoration pattern as `Modal.tsx`.
- `closeLabel` map replaces the hardcoded `"OK"` (Task 6 bundled in here since the file is already open).

---

## Task 2 — Keyboard Navigation in `Select`

**WCAG:** 2.1.1 Keyboard

**Problem:** The dropdown only responds to mouse clicks. Keyboard-only users cannot open it, navigate options, or make a selection.

**Pattern used:** `aria-activedescendant` — the trigger `<button>` retains focus; `aria-activedescendant` points to the currently highlighted option. This is the standard ARIA listbox pattern.

**File:** `components/ui/Select/Select.tsx` — full replacement

```tsx
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
  const listboxId = `${selectId}-listbox`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selected = value ?? '';
  const selectedLabel = options.find((o) => o.value === selected)?.label;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function openDropdown(startIndex?: number) {
    const idx = startIndex ?? options.findIndex((o) => o.value === selected);
    setActiveIndex(idx >= 0 ? idx : 0);
    setOpen(true);
  }

  function closeDropdown() {
    setOpen(false);
    setActiveIndex(-1);
    buttonRef.current?.focus();
  }

  function handleSelect(optValue: string) {
    onChange?.(optValue);
    closeDropdown();
  }

  function handleButtonKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open) {
          if (activeIndex >= 0) handleSelect(options[activeIndex].value);
          else closeDropdown();
        } else {
          openDropdown();
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          openDropdown();
        } else {
          setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!open) {
          openDropdown(options.length - 1);
        } else {
          setActiveIndex((i) => Math.max(i - 1, 0));
        }
        break;

      case 'Home':
        e.preventDefault();
        if (open) setActiveIndex(0);
        break;

      case 'End':
        e.preventDefault();
        if (open) setActiveIndex(options.length - 1);
        break;

      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;

      case 'Tab':
        // Close without preventing default so focus moves naturally
        if (open) {
          setOpen(false);
          setActiveIndex(-1);
        }
        break;
    }
  }

  const borderColor = getInputBorderColor(error, { active: open });
  const iconClass = error ? 'text-feedback-danger' : 'text-brand-primary';
  const activeOptionId = open && activeIndex >= 0 ? `${selectId}-option-${activeIndex}` : undefined;

  return (
    <div className="flex flex-col gap-sm">
      {label && <Label htmlFor={selectId}>{label}</Label>}

      <div ref={containerRef} className="relative">
        <button
          ref={buttonRef}
          id={selectId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={activeOptionId}
          onKeyDown={handleButtonKeyDown}
          onClick={() => (open ? closeDropdown() : openDropdown())}
          className={cn(
            'w-full flex items-center justify-between',
            'bg-surface rounded-default border',
            borderColor,
            'px-lg py-md',
            'body-default',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1',
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
            id={listboxId}
            role="listbox"
            aria-label={label ?? 'Opções'}
            className={cn(
              'absolute z-50 w-full mt-1',
              'bg-surface rounded-default border',
              borderColor,
              'overflow-hidden shadow-card'
            )}
          >
            {options.map((opt, i) => (
              <li
                key={opt.value}
                id={`${selectId}-option-${i}`}
                role="option"
                aria-selected={selected === opt.value}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  'flex items-center px-lg py-md',
                  'body-default text-content-primary',
                  'cursor-pointer transition-colors',
                  activeIndex === i
                    ? 'bg-badge-transfer-bg text-brand-primary outline-none ring-2 ring-inset ring-brand-primary'
                    : selected === opt.value
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
```

**Changes from original:**

- Removed `style={{ outline: 'none' }}` from the button; added `focus-visible:ring-2` class instead — the button must be visibly focusable.
- Added `buttonRef` — used by `closeDropdown()` to restore focus to the button after selection.
- Added `listboxId` (`${selectId}-listbox`) — assigned to `<ul id>`.
- Added `aria-controls` on the button pointing to `listboxId` (only when open, per spec).
- Added `activeIndex` state — drives `aria-activedescendant` and the active option highlight.
- Added `handleButtonKeyDown` — covers Enter/Space, ArrowDown/Up, Home/End, Escape, Tab.
- Each `<li>` now has a unique `id` (`${selectId}-option-${i}`) for `aria-activedescendant` referencing.
- Active option gets a visible ring highlight (not just background color).
- `openDropdown()` initialises `activeIndex` to the currently selected option, falling back to 0.

---

## Task 3 — `aria-invalid` + `aria-describedby` on `Input` and `CurrencyInput`

**WCAG:** 3.3.1 Error Identification, 4.1.2 Name, Role, Value

**Problem:** When a field is invalid and a helper text error message renders, screen readers have no programmatic link between the `<input>` and the error message. `DatePicker` already does this correctly — copy the pattern.

**`HelperText` already accepts an `id` prop** — no changes needed there.

---

### `components/ui/Input/Input.tsx` — full replacement

```tsx
import { useId } from 'react';
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
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div className="relative flex items-center">
        {leftAddon && <span className="absolute left-3 text-content-secondary">{leftAddon}</span>}
        <input
          id={inputId}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
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
      {helperText && (
        <HelperText id={helperId} error={error}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
}
```

**Changes from original:**

- Added `useId` import and `generatedId` — the old `label?.toLowerCase().replace(...)` fallback was fragile (fails when `label` is undefined and two unlabelled inputs share a page).
- Added `helperId` — only set when `helperText` is present (avoids `aria-describedby=""` on the input).
- Added `aria-invalid={error || undefined}` — `undefined` instead of `false` keeps the attribute absent when there's no error.
- Added `aria-describedby={helperId}`.
- Passed `id={helperId}` to `<HelperText>`.

---

### `components/ui/CurrencyInput/CurrencyInput.tsx` — full replacement

```tsx
'use client';

import { cn } from '@/lib/classes';
import type { CurrencyInputProps } from './ICurrencyInput';
import { getInputBorderColor } from '@/lib/input';
import { HelperText } from '@/components/ui/HelperText';
import { Label } from '@/components/ui/Label';
import { useEffect, useId, useState } from 'react';

export function CurrencyInput({
  value = 0,
  onValueChange,
  currency = 'R$',
  label,
  helperText,
  error,
  disabled,
  className,
  id,
  ...props
}: CurrencyInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  const [valueInCents, setValueInCents] = useState(Math.round(value * 100));

  useEffect(() => {
    setValueInCents(Math.round(value * 100));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '');
    const newValueInCents = Number(digits || '0');
    setValueInCents(newValueInCents);
    onValueChange?.(newValueInCents / 100);
  }

  const formatted = (valueInCents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex flex-col gap-sm">
      {label && <Label htmlFor={inputId}>{label}</Label>}

      <div
        className={cn(
          'flex rounded-default border overflow-hidden',
          getInputBorderColor(error, { variant: 'focus-within' }),
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'flex items-center px-lg py-md',
            'body-default',
            'bg-background border-r',
            getInputBorderColor(error),
            'select-none'
          )}
        >
          {currency}
        </span>

        <input
          id={inputId}
          inputMode="numeric"
          disabled={disabled}
          value={formatted}
          onChange={handleChange}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          aria-label={label ? undefined : `Valor em ${currency}`}
          style={{ outline: 'none' }}
          className={cn(
            'flex-1 px-lg py-md',
            'body-default text-content-primary',
            'bg-surface',
            'focus:ring-0',
            'disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
      </div>

      {helperText && (
        <HelperText id={helperId} error={error}>
          {helperText}
        </HelperText>
      )}
    </div>
  );
}
```

**Changes from original:**

- Added `helperId`.
- Added `aria-invalid` and `aria-describedby` on the `<input>`.
- Added `aria-hidden="true"` on the currency `<span>` — it's decorative since the label already names the field; screen readers should not read "R$" separately.
- Added `aria-label={label ? undefined : \`Valor em ${currency}\`}` — fallback for when `CurrencyInput` is rendered without a `label` prop (the visual "R$" would otherwise be the only name hint).
- Passed `id={helperId}` to `<HelperText>`.

---

## Task 4 — Page Structure and Heading Hierarchy

**WCAG:** 2.4.6 Headings and Labels, 1.3.1 Info and Relationships

**Problem:** Screen reader users navigate pages by headings and landmarks. The home page has no headings and its content areas are bare `<div>`s. `BalanceCard` renders an `<h1>` for the owner greeting, but it lives inside a component — it's not the page title, and it duplicates the page's `<h1>`.

---

### `app/page.tsx` — full replacement

```tsx
'use client';
import { BalanceCard } from '@/components/features/BalanceCard';
import { NewTransaction } from '@/components/features/NewTransaction';
import { TransactionList } from '@/components/features/TransactionList';
import { Button } from '@/components/ui/Button/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTransactions } from '@/context/TransactionsContext';
import Link from 'next/link';
import { useMemo } from 'react';

export default function Home() {
  const { transactions, balance, isLoading } = useTransactions();
  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

  return (
    <div className="flex flex-col gap-lg lg:flex-row lg:items-start h-fit w-full">
      <section
        aria-labelledby="overview-heading"
        className="flex flex-col gap-lg lg:flex-1 min-w-0"
      >
        <h1 id="overview-heading" className="sr-only">
          Visão geral da conta
        </h1>
        {isLoading ? (
          <Skeleton className="h-134.5 md:h-91 w-full rounded-xl" />
        ) : (
          <BalanceCard balance={balance} owner="Joana" />
        )}
        <NewTransaction />
      </section>

      <section
        aria-labelledby="recent-tx-heading"
        className="lg:w-80 lg:shrink-0 flex flex-col gap-lg w-full min-w-0"
      >
        <h2 id="recent-tx-heading" className="sr-only">
          Transações recentes
        </h2>
        <TransactionList
          transactions={recentTransactions}
          onEdit={(id) => console.log(id)}
          onDelete={(id) => console.log(id)}
          title="Transações recentes"
          showActions={false}
          tooltipPosition="left"
          isLoading={isLoading}
        />

        <Link href="/transactions">
          <Button className="w-full" disabled={isLoading}>
            Todas as transações
          </Button>
        </Link>
      </section>
    </div>
  );
}
```

**Changes from original:**

- Both `<div>` columns replaced with `<section aria-labelledby>`.
- Added `sr-only` `<h1>` for the left column (overview) and `sr-only` `<h2>` for the right column (recent transactions). Screen readers announce these when navigating by landmarks/headings; they're invisible visually.

---

### `app/transactions/page.tsx` — targeted change inside `TransactionsContent`

Wrap the page content in a `<section>` labelled by the existing `<h1>`:

```tsx
// Before
return (
  <>
    <div className="flex flex-col gap-lg h-full">
      <h1 className="heading text-content-primary text-xl">Transações</h1>
      ...
    </div>
    ...modals
  </>
);

// After
return (
  <>
    <section aria-labelledby="transactions-heading" className="flex flex-col gap-lg h-full">
      <h1 id="transactions-heading" className="heading text-content-primary text-xl">
        Transações
      </h1>
      <TransactionFilters value={filters} onChange={setFilters} onClear={clearFilters} />
      <TransactionList
        transactions={filtered}
        isLoading={isLoading}
        onEdit={handleEditRequest}
        onDelete={handleDeleteRequest}
        emptyMessage="Nenhuma transação encontrada para os filtros selecionados."
        className="w-full overflow-y-auto h-full"
      />
    </section>
    <DeleteTransactionModal ... />
    <EditTransactionModal ... />
  </>
);
```

**Changes:** `<div>` → `<section aria-labelledby="transactions-heading">`, added `id` to the existing `<h1>`.

---

### `components/features/BalanceCard/BalanceCard.tsx` — targeted change

The `<h1>` for the owner greeting is inside a card component, not a page-level heading. Change it to `<p>` so the heading hierarchy isn't disrupted.

```tsx
// Before (line ~46)
{
  owner && <h1 className="text-xl font-semibold mb-sm">Olá, {owner}! :)</h1>;
}

// After
{
  owner && <p className="text-xl font-semibold mb-sm">Olá, {owner}! :)</p>;
}
```

Only the tag changes; class stays the same. The visual appearance is identical.

---

## Task 5 — Tooltip Keyboard / AT Fallback

**WCAG:** 2.1.1 Keyboard

**Problem:** `Tooltip` only shows on `mouseenter`. In `TransactionItem`, a description that overflows is truncated and wrapped in a `Tooltip`. Keyboard-only and screen reader users never see the full text.

Two-part fix:

### Part A — `TransactionItem.tsx` (quick fix, no Tooltip changes needed)

Add `aria-label` to the truncated `<p>` so screen readers always announce the full description, regardless of truncation or tooltip visibility.

```tsx
// Before
<Tooltip content={description} position={tooltipPosition}>
  <p className="mb-1 @md:mb-0 truncate font-normal text-content-primary">
    {description}
  </p>
</Tooltip>

// After
<Tooltip content={description} position={tooltipPosition}>
  <p
    className="mb-1 @md:mb-0 truncate font-normal text-content-primary"
    title={description}
    aria-label={description}
  >
    {description}
  </p>
</Tooltip>
```

- `aria-label` — screen readers read this instead of the truncated visible text.
- `title` — shows a native browser tooltip on keyboard focus (hover in most browsers; also shows on focus in some).

### Part B — `Tooltip.tsx` (enhancement, adds keyboard support)

Add `onFocus` / `onBlur` so the tooltip also appears when a child element receives keyboard focus.

```tsx
// Before
<div ref={ref} className="min-w-0 w-full" onMouseEnter={show} onMouseLeave={hide}>

// After
<div ref={ref} className="min-w-0 w-full" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
```

One-line change. `show` already checks whether the child text is truncated (`child.scrollWidth <= child.clientWidth`) before setting coords — that guard still applies.

---

## Task 6 — `FeedbackModal` Close Button Text

This was bundled into the **Task 1 replacement** of `FeedbackModal.tsx` above (the `closeLabel` map). No additional changes needed.

For reference, the mapping applied is:

| `type`    | Button label |
| --------- | ------------ |
| `success` | Fechar       |
| `error`   | Entendido    |
| `info`    | OK           |

---

## Manual Testing Checklist

Run through each flow **using only the keyboard** (Tab, Shift+Tab, Enter, Space, Escape, Arrow keys — no mouse).

### Modals

- [ ] Open a `ConfirmTransactionModal` via Enter on its trigger → focus moves into the modal → Tab cycles through all buttons without escaping → Escape closes → focus returns to the trigger
- [ ] Open `EditTransactionModal` via Enter on an edit button → Tab through all form fields → Escape cancels → focus returns to the edit button
- [ ] Open `DeleteTransactionModal` via Enter on a delete button → Tab between Cancel and Confirm → Enter on Confirm → `FeedbackModal` opens → focus moves to the OK button → Enter closes → focus returns to the delete button
- [ ] `FeedbackModal` for a success action: close button says "Fechar"; for error: says "Entendido"

### Select

- [ ] Tab to a `Select` → Enter opens the dropdown → ArrowDown / ArrowUp moves the highlighted option → Enter selects → dropdown closes, focus stays on the button
- [ ] Open a `Select` → press Escape → dropdown closes, focus stays on the button
- [ ] Open a `Select` → press Home / End → first / last option highlights
- [ ] Open a `Select` → press Tab → dropdown closes, focus moves to next element

### Form inputs

- [ ] Submit a `TransactionForm` with an empty required field → screen reader (VoiceOver/NVDA) announces the error message next to the field (verify `aria-invalid` + `aria-describedby` are wired)

### Page navigation

- [ ] Open VoiceOver (macOS: Cmd+F5) → navigate by headings (VO+Cmd+H) on the home page → should find "Visão geral da conta" (h1) and "Transações recentes" (h2)
- [ ] Same on `/transactions` → should find "Transações" (h1)
- [ ] Navigate by landmarks (VO+Cmd+L) → `<section>` elements should appear as regions

### Truncated descriptions

- [ ] Tab to a `TransactionItem` with a long description → VoiceOver reads the full description (not just the truncated text)

---

## Color Contrast Check (Day 45 bonus)

Use Chrome DevTools → Accessibility panel, or [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

Target: **4.5:1** for body text, **3:1** for large text and UI components.

| Foreground token                  | Background token          | Where used                          |
| --------------------------------- | ------------------------- | ----------------------------------- |
| `text-content-primary`            | `surface-primary`         | Body text, transaction descriptions |
| `text-content-inverse`            | `brand-primary`           | Primary button label                |
| `text-content-secondary`          | `surface-primary`         | Helper text, dates, balance label   |
| `text-content-primary`            | `brand-dark`              | BalanceCard text on dark background |
| Focus ring (`ring-brand-primary`) | white / `surface-primary` | All focusable elements              |
| `text-feedback-danger`            | `surface-primary`         | Error messages                      |

To check the focus ring contrast: tab through the page and visually inspect whether the ring is distinguishable from the surrounding background.

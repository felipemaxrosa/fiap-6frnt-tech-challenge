# Day 11-13: Form Components (Design System)

## Goals

- Build the form-specific components that power the transaction add/edit flows
- Ensure consistent validation UX across all form inputs
- Document all components in Storybook with all variants

---

## Prerequisites

Before starting, confirm the following items from Days 8-10 are ready:

- [ ] `Button`, `Input`, `Badge`, and `Card` components implemented and exported
- [ ] `components/ui/index.ts` barrel export in place
- [ ] Design tokens (`tokens.css`) available and working in Storybook
- [ ] `types/index.ts` defines `TransactionType` (`'income' | 'expense' | 'transfer'`)

---

## Expected folder structure at the end

```
components/
└── ui/
    ├── Select/
    │   ├── Select.tsx
    │   ├── Select.stories.tsx
    │   └── index.ts
    ├── CurrencyInput/
    │   ├── CurrencyInput.tsx
    │   ├── CurrencyInput.stories.tsx
    │   └── index.ts
    ├── DatePicker/
    │   ├── DatePicker.tsx
    │   ├── DatePicker.stories.tsx
    │   └── index.ts
    └── FormField/
        ├── FormField.tsx
        ├── FormField.stories.tsx
        └── index.ts
```

---

## Component 1 — `Select`

### Purpose

Dropdown used to pick the transaction type (`income`, `expense`, `transfer`). Built as a styled wrapper around the native `<select>` element to keep it accessible and keyboard-friendly out of the box.

### Variants to implement

| Prop          | Values                                    |
| ------------- | ----------------------------------------- |
| `options`     | `Array<{ label: string; value: string }>` |
| `placeholder` | string shown as the first disabled option |
| `error`       | `true` / `false`                          |
| `disabled`    | `true` / `false`                          |
| `label`       | optional string                           |
| `helperText`  | optional string (error or hint message)   |

### TypeScript interface

```ts
// components/ui/Select/types.ts
export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  placeholder?: string
  label?: string
  helperText?: string
  error?: boolean
}
```

### Suggested implementation

```tsx
// components/ui/Select/Select.tsx
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { SelectProps } from './types'

export function Select({
  options,
  placeholder,
  label,
  helperText,
  error,
  disabled,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          disabled={disabled}
          className={cn(
            'w-full appearance-none rounded-md border bg-surface px-3 py-2',
            'text-base text-text-primary transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-expense focus:ring-expense' : 'border-border',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
      </div>
      {helperText && (
        <p className={cn('text-xs', error ? 'text-expense' : 'text-text-secondary')}>
          {helperText}
        </p>
      )}
    </div>
  )
}
```

### Storybook stories

```tsx
// components/ui/Select/Select.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Select } from './Select'

const TRANSACTION_TYPE_OPTIONS = [
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
  { label: 'Transfer', value: 'transfer' },
]

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  args: { options: TRANSACTION_TYPE_OPTIONS },
}
export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = { args: { label: 'Transaction type', placeholder: 'Select a type' } }
export const WithError: Story = {
  args: { label: 'Transaction type', error: true, helperText: 'Please select a type' },
}
export const Disabled: Story = {
  args: { label: 'Transaction type', disabled: true, value: 'income' },
}
export const NoLabel: Story = { args: { placeholder: 'Select a type' } }
```

---

## Component 2 — `CurrencyInput`

### Purpose

A number input that formats its value as currency (e.g. `1,250.00`) while the user types. Prevents non-numeric characters and keeps the raw numeric value accessible for form handling.

### Variants to implement

| Prop            | Values                                        |
| --------------- | --------------------------------------------- |
| `currency`      | string — currency symbol prefix (default `$`) |
| `value`         | `number` — controlled raw numeric value       |
| `onValueChange` | `(value: number) => void` — emits raw number  |
| `error`         | `true` / `false`                              |
| `disabled`      | `true` / `false`                              |
| `label`         | optional string                               |
| `helperText`    | optional string                               |

> **Why a custom `onValueChange`?**
> Native `onChange` returns a string from the input. `onValueChange` emits the parsed `number` directly, making it straightforward to integrate with React Hook Form or local state.

### TypeScript interface

```ts
// components/ui/CurrencyInput/types.ts
export interface CurrencyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> {
  value?: number
  onValueChange?: (value: number) => void
  currency?: string
  label?: string
  helperText?: string
  error?: boolean
}
```

### Suggested implementation

```tsx
// components/ui/CurrencyInput/CurrencyInput.tsx
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { CurrencyInputProps } from './types'

function formatDisplay(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function CurrencyInput({
  value = 0,
  onValueChange,
  currency = '$',
  label,
  helperText,
  error,
  disabled,
  className,
  id,
  ...props
}: CurrencyInputProps) {
  const [display, setDisplay] = useState(formatDisplay(value))
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  useEffect(() => {
    setDisplay(formatDisplay(value))
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Strip everything except digits and dots
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    const numeric = parseFloat(raw) || 0
    setDisplay(raw)
    onValueChange?.(numeric)
  }

  function handleBlur() {
    // Re-format on blur for a clean display
    const numeric = parseFloat(display.replace(/[^0-9.]/g, '')) || 0
    setDisplay(formatDisplay(numeric))
    onValueChange?.(numeric)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-sm font-medium text-text-secondary select-none">
          {currency}
        </span>
        <input
          id={inputId}
          inputMode="decimal"
          disabled={disabled}
          value={display}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            'w-full rounded-md border bg-surface pl-7 pr-3 py-2',
            'text-base text-text-primary transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-expense focus:ring-expense' : 'border-border',
            className
          )}
          {...props}
        />
      </div>
      {helperText && (
        <p className={cn('text-xs', error ? 'text-expense' : 'text-text-secondary')}>
          {helperText}
        </p>
      )}
    </div>
  )
}
```

### Storybook stories

```tsx
// components/ui/CurrencyInput/CurrencyInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { CurrencyInput } from './CurrencyInput'

const meta: Meta<typeof CurrencyInput> = {
  title: 'UI/CurrencyInput',
  component: CurrencyInput,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof CurrencyInput>

export const Default: Story = {
  args: { label: 'Amount', value: 0 },
}
export const WithValue: Story = {
  args: { label: 'Amount', value: 1250.5 },
}
export const WithError: Story = {
  args: { label: 'Amount', value: 0, error: true, helperText: 'Amount must be greater than zero' },
}
export const Disabled: Story = {
  args: { label: 'Amount', value: 500, disabled: true },
}
export const Controlled: Story = {
  render: () => {
    const [amount, setAmount] = useState(0)
    return (
      <div className="flex flex-col gap-2">
        <CurrencyInput label="Amount" value={amount} onValueChange={setAmount} />
        <p className="text-sm text-text-secondary">Raw value: {amount}</p>
      </div>
    )
  },
}
```

---

## Component 3 — `DatePicker`

### Purpose

A styled wrapper around the native `<input type="date">` that applies the design system's visual language. Native date inputs give us keyboard navigation and mobile pickers for free.

### Variants to implement

| Prop         | Values                                |
| ------------ | ------------------------------------- |
| `label`      | optional string                       |
| `helperText` | optional string                       |
| `error`      | `true` / `false`                      |
| `disabled`   | `true` / `false`                      |
| `min`        | string — ISO date string `YYYY-MM-DD` |
| `max`        | string — ISO date string `YYYY-MM-DD` |

### TypeScript interface

```ts
// components/ui/DatePicker/types.ts
export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: boolean
}
```

### Suggested implementation

```tsx
// components/ui/DatePicker/DatePicker.tsx
import { cn } from '@/lib/utils'
import { Calendar } from 'lucide-react'
import { DatePickerProps } from './types'

export function DatePicker({
  label,
  helperText,
  error,
  disabled,
  className,
  id,
  ...props
}: DatePickerProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <Calendar size={16} className="pointer-events-none absolute left-3 text-text-secondary" />
        <input
          id={inputId}
          type="date"
          disabled={disabled}
          className={cn(
            'w-full rounded-md border bg-surface pl-9 pr-3 py-2',
            'text-base text-text-primary transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-expense focus:ring-expense' : 'border-border',
            className
          )}
          {...props}
        />
      </div>
      {helperText && (
        <p className={cn('text-xs', error ? 'text-expense' : 'text-text-secondary')}>
          {helperText}
        </p>
      )}
    </div>
  )
}
```

### Storybook stories

```tsx
// components/ui/DatePicker/DatePicker.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DatePicker } from './DatePicker'

const meta: Meta<typeof DatePicker> = {
  title: 'UI/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = { args: { label: 'Date' } }
export const WithValue: Story = { args: { label: 'Date', value: '2025-03-08' } }
export const WithError: Story = {
  args: { label: 'Date', error: true, helperText: 'Please select a valid date' },
}
export const Disabled: Story = { args: { label: 'Date', disabled: true, value: '2025-03-08' } }
export const WithRange: Story = {
  args: {
    label: 'Date',
    min: '2025-01-01',
    max: '2025-12-31',
    helperText: 'Only dates within 2025 are allowed',
  },
}
```

---

## Component 4 — `FormField`

### Purpose

A layout wrapper that composes a `label`, any input element (passed as `children`), and an error/helper message into a consistent, vertically-stacked unit. Use this as the standard container for every field in a form to avoid duplicating label/error markup.

### Design decisions

- Accepts `children` rather than a specific input component, making it flexible enough to wrap `Input`, `Select`, `CurrencyInput`, `DatePicker`, or any future field.
- Manages the `id`↔`htmlFor` link automatically via a prop, so screen readers always associate the label with the control.
- The `required` prop renders a visual asterisk next to the label.

### Variants to implement

| Prop         | Values                                             |
| ------------ | -------------------------------------------------- |
| `label`      | string — field label text                          |
| `htmlFor`    | string — id of the input it labels                 |
| `helperText` | optional string — shown below the field            |
| `error`      | optional string — replaces helperText when present |
| `required`   | `true` / `false` — shows `*` next to label         |

### TypeScript interface

```ts
// components/ui/FormField/types.ts
export interface FormFieldProps {
  label: string
  htmlFor: string
  helperText?: string
  error?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}
```

### Suggested implementation

```tsx
// components/ui/FormField/FormField.tsx
import { cn } from '@/lib/utils'
import { FormFieldProps } from './types'

export function FormField({
  label,
  htmlFor,
  helperText,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  const message = error ?? helperText

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-text-primary">
        {label}
        {required && (
          <span className="ml-1 text-expense" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {message && (
        <p
          id={`${htmlFor}-description`}
          className={cn('text-xs', error ? 'text-expense' : 'text-text-secondary')}
          role={error ? 'alert' : undefined}
        >
          {message}
        </p>
      )}
    </div>
  )
}
```

> **Tip — linking the helper text to the input for screen readers:**
> Pass `aria-describedby={`${id}-description`}` on the inner input whenever `helperText` or `error` is present. `FormField` automatically renders the message with that matching `id`.

### Usage example inside a form

```tsx
<FormField label="Amount" htmlFor="amount" error={errors.amount?.message} required>
  <CurrencyInput
    id="amount"
    value={watch('amount')}
    onValueChange={(v) => setValue('amount', v)}
    aria-describedby="amount-description"
    error={!!errors.amount}
  />
</FormField>

<FormField label="Transaction type" htmlFor="type" error={errors.type?.message} required>
  <Select
    id="type"
    options={TRANSACTION_TYPE_OPTIONS}
    placeholder="Select a type"
    aria-describedby="type-description"
    error={!!errors.type}
    {...register('type')}
  />
</FormField>
```

### Storybook stories

```tsx
// components/ui/FormField/FormField.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from '../Input'
import { Select } from '../Select'
import { CurrencyInput } from '../CurrencyInput'
import { DatePicker } from '../DatePicker'
import { FormField } from './FormField'

const meta: Meta<typeof FormField> = {
  title: 'UI/FormField',
  component: FormField,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof FormField>

export const WithInput: Story = {
  render: () => (
    <FormField
      label="Description"
      htmlFor="description"
      helperText="A short note about this transaction"
    >
      <Input id="description" placeholder="e.g. Grocery shopping" />
    </FormField>
  ),
}
export const WithError: Story = {
  render: () => (
    <FormField label="Description" htmlFor="description-err" error="This field is required">
      <Input id="description-err" error placeholder="e.g. Grocery shopping" />
    </FormField>
  ),
}
export const Required: Story = {
  render: () => (
    <FormField label="Amount" htmlFor="amount-req" required>
      <CurrencyInput id="amount-req" value={0} />
    </FormField>
  ),
}
export const WithSelect: Story = {
  render: () => (
    <FormField label="Transaction type" htmlFor="type-field" required>
      <Select
        id="type-field"
        placeholder="Select a type"
        options={[
          { label: 'Income', value: 'income' },
          { label: 'Expense', value: 'expense' },
          { label: 'Transfer', value: 'transfer' },
        ]}
      />
    </FormField>
  ),
}
export const FullTransactionForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96 p-6 rounded-lg border border-border bg-surface shadow-card">
      <h2 className="text-lg font-semibold text-text-primary">New Transaction</h2>
      <FormField label="Transaction type" htmlFor="type-full" required>
        <Select
          id="type-full"
          placeholder="Select a type"
          options={[
            { label: 'Income', value: 'income' },
            { label: 'Expense', value: 'expense' },
            { label: 'Transfer', value: 'transfer' },
          ]}
        />
      </FormField>
      <FormField label="Amount" htmlFor="amount-full" required>
        <CurrencyInput id="amount-full" value={0} />
      </FormField>
      <FormField label="Date" htmlFor="date-full" required>
        <DatePicker id="date-full" />
      </FormField>
      <FormField label="Description" htmlFor="desc-full" helperText="Optional">
        <Input id="desc-full" placeholder="e.g. Grocery shopping" />
      </FormField>
    </div>
  ),
}
```

---

## Export pattern

```ts
// components/ui/Select/index.ts
export { Select } from './Select'
export type { SelectProps, SelectOption } from './types'

// components/ui/CurrencyInput/index.ts
export { CurrencyInput } from './CurrencyInput'
export type { CurrencyInputProps } from './types'

// components/ui/DatePicker/index.ts
export { DatePicker } from './DatePicker'
export type { DatePickerProps } from './types'

// components/ui/FormField/index.ts
export { FormField } from './FormField'
export type { FormFieldProps } from './types'
```

Update the global barrel export:

```ts
// components/ui/index.ts
export * from './Button'
export * from './Input'
export * from './Badge'
export * from './Card'
export * from './Select' // ← new
export * from './CurrencyInput' // ← new
export * from './DatePicker' // ← new
export * from './FormField' // ← new
```

---

## Checklist

### Select

- [ ] Renders all provided `options`
- [ ] `placeholder` shown as first disabled option
- [ ] Error border and helper text
- [ ] `disabled` state
- [ ] Chevron icon (no native arrow)
- [ ] Stories documented in Storybook

### CurrencyInput

- [ ] Formats value with thousand separators and 2 decimal places on blur
- [ ] `onValueChange` emits raw `number`
- [ ] Currency symbol prefix visible
- [ ] Error state with helper text
- [ ] `disabled` state
- [ ] `inputMode="decimal"` for correct mobile keyboard
- [ ] Stories documented in Storybook

### DatePicker

- [ ] Calendar icon in left addon
- [ ] `min` / `max` range constraints work
- [ ] Error state with helper text
- [ ] `disabled` state
- [ ] Stories documented in Storybook

### FormField

- [ ] `label` linked to child input via `htmlFor`
- [ ] Required asterisk renders when `required={true}`
- [ ] `error` message shown in red with `role="alert"`
- [ ] `helperText` shown in muted color when no error
- [ ] Wraps any input component as `children`
- [ ] `FullTransactionForm` story renders correctly in Storybook
- [ ] Stories documented in Storybook

### General

- [ ] All components consume tokens from `tokens.css`
- [ ] Barrel exports updated in `components/ui/index.ts`
- [ ] Each component has its own `index.ts`
- [ ] Basic accessibility: labels, `aria-describedby`, keyboard support
- [ ] Storybook running with `autodocs` enabled on all components

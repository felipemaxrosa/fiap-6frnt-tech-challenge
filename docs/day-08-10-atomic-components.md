# Day 8-10: Atomic Components (Design System)

## Goals

- Build the base atomic components of the Design System
- Ensure each component is reusable, accessible, and aligned with the tokens defined on Days 3-4
- Document all components in Storybook with all variants

---

## Prerequisites

Before starting, confirm the following items from Days 3-4 are ready:

- [ ] `app/tokens.css` with `@theme` block created
- [ ] `globals.css` importing the tokens file
- [ ] Storybook running with `preview.ts` loading the global CSS
- [ ] Tokens correctly generating Tailwind utility classes (`bg-primary`, `text-income`, etc.)

---

## Setup — `lib/utils.ts`

Every component in this phase imports `cn` from `@/lib/utils`. This utility merges Tailwind class names safely, resolving conflicts (e.g. two `border-*` classes) by keeping the last one. It combines `clsx` for conditional logic and `tailwind-merge` for conflict resolution.

### Install dependencies

```bash
npm install clsx tailwind-merge
```

### Create the file

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

### Usage

```tsx
// Conditionals
cn('px-3 py-2', isActive && 'bg-primary', className)

// Conflict resolution — twMerge keeps 'p-4', drops 'p-2'
cn('p-2', 'p-4') // → 'p-4'
```

> If the project was bootstrapped with **shadcn/ui**, `lib/utils.ts` is already created automatically. Verify it exists before reinstalling.

- [ ] `clsx` and `tailwind-merge` installed
- [ ] `lib/utils.ts` created and exporting `cn`
- [ ] `@/lib/utils` path alias resolving correctly (check `tsconfig.json` paths)

---

## Expected folder structure at the end

```
components/
└── ui/
    ├── Button/
    │   ├── Button.tsx
    │   ├── Button.stories.tsx
    │   └── index.ts
    ├── Input/
    │   ├── Input.tsx
    │   ├── Input.stories.tsx
    │   └── index.ts
    ├── Badge/
    │   ├── Badge.tsx
    │   ├── Badge.stories.tsx
    │   └── index.ts
    └── Card/
        ├── Card.tsx
        ├── Card.stories.tsx
        └── index.ts
```

---

## Component 1 — `Button`

### Variants to implement

| Prop        | Values                                    |
| ----------- | ----------------------------------------- |
| `variant`   | `primary`, `secondary`, `danger`, `ghost` |
| `size`      | `sm`, `md`, `lg`                          |
| `disabled`  | `true` / `false`                          |
| `loading`   | `true` / `false` (shows spinner)          |
| `leftIcon`  | Optional React node (icon on the left)    |
| `rightIcon` | Optional React node (icon on the right)   |
| `fullWidth` | `true` / `false`                          |

### TypeScript interface

```ts
// types/index.ts or Button.tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}
```

### Suggested implementation

```tsx
// components/ui/Button/Button.tsx
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ButtonProps } from './types'

const variantStyles = {
  primary: 'bg-primary text-text-inverse hover:bg-primary-hover',
  secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-hover',
  danger: 'bg-expense text-text-inverse hover:bg-red-700',
  ghost: 'text-text-primary hover:bg-surface-hover',
}

const sizeStyles = {
  sm: 'h-8  px-3 text-sm  gap-1.5',
  md: 'h-10 px-4 text-base gap-2',
  lg: 'h-12 px-6 text-lg  gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
}
```

### Responsive behavior

`Button` is an inline element by default and has no built-in breakpoint logic. Use the `fullWidth` prop in mobile form layouts so the button spans the full container width, and remove it on wider screens by wrapping the button in a flex/grid parent.

```tsx
// Full-width on mobile, auto-width on sm+
<div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
  <Button variant="secondary" fullWidth>
    Cancel
  </Button>
  <Button fullWidth>Save</Button>
</div>
```

### Storybook stories

```tsx
// components/ui/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Plus } from 'lucide-react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { children: 'Confirm', variant: 'primary' } }
export const Secondary: Story = { args: { children: 'Cancel', variant: 'secondary' } }
export const Danger: Story = { args: { children: 'Delete', variant: 'danger' } }
export const Ghost: Story = { args: { children: 'View more', variant: 'ghost' } }
export const WithIcon: Story = {
  args: { children: 'New transaction', leftIcon: <Plus size={16} /> },
}
export const Loading: Story = { args: { children: 'Saving...', loading: true } }
export const Disabled: Story = { args: { children: 'Unavailable', disabled: true } }
export const FullWidth: Story = { args: { children: 'Sign in', fullWidth: true } }
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
```

---

## Component 2 — `Input`

### Variants to implement

| Prop         | Values                                        |
| ------------ | --------------------------------------------- |
| `type`       | `text`, `number`, `date`, `email`             |
| `state`      | default, `error`, `success`, `disabled`       |
| `label`      | optional string                               |
| `helperText` | string (support message or error description) |
| `leftAddon`  | React node (icon or symbol — e.g. `$`)        |
| `rightAddon` | React node (action icon)                      |

### TypeScript interface

```ts
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: boolean
  success?: boolean
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
}
```

### Suggested implementation

```tsx
// components/ui/Input/Input.tsx
import { cn } from '@/lib/utils'
import { InputProps } from './types'

export function Input({
  label,
  helperText,
  error,
  success,
  leftAddon,
  rightAddon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftAddon && <span className="absolute left-3 text-text-secondary">{leftAddon}</span>}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-md border bg-surface px-3 py-2 text-base text-text-primary',
            'placeholder:text-text-muted transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-expense focus:ring-expense',
            success && 'border-income focus:ring-income',
            !error && !success && 'border-border',
            leftAddon && 'pl-9',
            rightAddon && 'pr-9',
            className
          )}
          {...props}
        />
        {rightAddon && <span className="absolute right-3 text-text-secondary">{rightAddon}</span>}
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

### Responsive behavior

`Input` renders `w-full` by default, so it fills its container on all screen sizes. No breakpoint overrides are needed on the component itself — control width from the parent layout (e.g. a form grid).

### Storybook stories

```tsx
// components/ui/Input/Input.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DollarSign } from 'lucide-react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = { args: { label: 'Description', placeholder: 'e.g. Salary' } }
export const WithError: Story = {
  args: { label: 'Amount', error: true, helperText: 'This field is required', placeholder: '0.00' },
}
export const WithSuccess: Story = {
  args: { label: 'Email', success: true, helperText: 'Valid email', value: 'user@email.com' },
}
export const Disabled: Story = { args: { label: 'ID', disabled: true, value: '00123' } }
export const TypeDate: Story = { args: { label: 'Date', type: 'date' } }
export const TypeNumber: Story = { args: { label: 'Amount', type: 'number', placeholder: '0' } }
export const WithLeftAddon: Story = {
  args: {
    label: 'Amount',
    leftAddon: <DollarSign size={16} />,
    placeholder: '0.00',
    type: 'number',
  },
}
```

---

## Component 3 — `Badge`

### Variants to implement

Used to indicate the **transaction type** and other statuses.

| Prop      | Values                                            |
| --------- | ------------------------------------------------- |
| `variant` | `income`, `expense`, `transfer`, `neutral`        |
| `size`    | `sm`, `md`                                        |
| `dot`     | `true` / `false` (shows a circular dot indicator) |

### TypeScript interface

```ts
export interface BadgeProps {
  variant?: 'income' | 'expense' | 'transfer' | 'neutral'
  size?: 'sm' | 'md'
  dot?: boolean
  children: React.ReactNode
  className?: string
}
```

### Suggested implementation

```tsx
// components/ui/Badge/Badge.tsx
import { cn } from '@/lib/utils'
import { BadgeProps } from './types'

const variantStyles = {
  income: 'bg-income-bg   text-income   border-green-200',
  expense: 'bg-expense-bg  text-expense  border-red-200',
  transfer: 'bg-transfer-bg text-transfer border-yellow-200',
  neutral: 'bg-gray-100    text-gray-600  border-gray-200',
}

const dotColors = {
  income: 'bg-income',
  expense: 'bg-expense',
  transfer: 'bg-transfer',
  neutral: 'bg-gray-400',
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  )
}
```

### Responsive behavior

`Badge` is an inline-flex element. No breakpoint overrides are needed — it adapts naturally to its parent's flow. The `size="sm"` variant works well inside compact mobile rows.

### Storybook stories

```tsx
// components/ui/Badge/Badge.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Badge>

export const Income: Story = { args: { variant: 'income', children: 'Income', dot: true } }
export const Expense: Story = { args: { variant: 'expense', children: 'Expense', dot: true } }
export const Transfer: Story = { args: { variant: 'transfer', children: 'Transfer', dot: true } }
export const Neutral: Story = { args: { variant: 'neutral', children: 'Pending' } }
export const Small: Story = {
  args: { variant: 'income', children: 'Income', size: 'sm', dot: true },
}
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="income" dot>
        Income
      </Badge>
      <Badge variant="expense" dot>
        Expense
      </Badge>
      <Badge variant="transfer" dot>
        Transfer
      </Badge>
      <Badge variant="neutral">Pending</Badge>
    </div>
  ),
}
```

---

## Component 4 — `Card`

### Variants to implement

Base surface component used to group and contain content.

| Prop        | Values                                       |
| ----------- | -------------------------------------------- |
| `padding`   | `none`, `sm`, `md`, `lg`                     |
| `hoverable` | `true` / `false` (hover shadow effect)       |
| `as`        | `div`, `article`, `section` (default: `div`) |

### TypeScript interface

```ts
export interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  as?: 'div' | 'article' | 'section'
  className?: string
  children: React.ReactNode
}
```

### Suggested implementation

```tsx
// components/ui/Card/Card.tsx
import { cn } from '@/lib/utils'
import { CardProps } from './types'

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
}

export function Card({
  padding = 'md',
  hoverable = false,
  as: Tag = 'div',
  className,
  children,
}: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-lg bg-surface border border-border shadow-card',
        paddingStyles[padding],
        hoverable && 'transition-shadow cursor-pointer hover:shadow-card-hover',
        className
      )}
    >
      {children}
    </Tag>
  )
}
```

### Responsive behavior

`Card` fills the width of its parent by default. Control layout from the outside — for example, a `grid grid-cols-1 sm:grid-cols-3` parent makes cards go from stacked to side-by-side. The `padding` prop lets you use tighter padding on mobile (`sm`) and larger on desktop (`lg`).

### Storybook stories

```tsx
// components/ui/Card/Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: <p className="text-text-secondary">Card content goes here</p>,
  },
}
export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: <p className="text-text-secondary">Hover over me</p>,
  },
}
export const Padding: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card padding="sm">
        <p className="text-sm">Padding SM</p>
      </Card>
      <Card padding="md">
        <p className="text-sm">Padding MD</p>
      </Card>
      <Card padding="lg">
        <p className="text-sm">Padding LG</p>
      </Card>
    </div>
  ),
}
export const AsArticle: Story = {
  args: {
    as: 'article',
    children: <p className="text-text-secondary">Semantic article tag</p>,
  },
}
```

---

## Export pattern

Each component should have an `index.ts` for clean imports:

```ts
// components/ui/Button/index.ts
export { Button } from './Button'
export type { ButtonProps } from './types'
```

And a global barrel export at `components/ui/index.ts`:

```ts
// components/ui/index.ts
export * from './Button'
export * from './Input'
export * from './Badge'
export * from './Card'
```

---

## Checklist

### Button

- [ ] Variants: `primary`, `secondary`, `danger`, `ghost`
- [ ] Sizes: `sm`, `md`, `lg`
- [ ] `loading` state with spinner
- [ ] `disabled` state
- [ ] Support for `leftIcon` and `rightIcon`
- [ ] `fullWidth` prop
- [ ] Stories documented in Storybook

### Input

- [ ] Types: `text`, `number`, `date`
- [ ] Error state with message
- [ ] Success state
- [ ] `disabled` state
- [ ] Support for `leftAddon` and `rightAddon`
- [ ] `label` and `helperText`
- [ ] Stories documented in Storybook

### Badge

- [ ] Variants: `income`, `expense`, `transfer`, `neutral`
- [ ] Sizes: `sm`, `md`
- [ ] `dot` option
- [ ] Stories documented in Storybook

### Card

- [ ] Padding variants: `none`, `sm`, `md`, `lg`
- [ ] `hoverable` prop
- [ ] `as` prop for semantic tag
- [ ] Stories documented in Storybook

### General

- [ ] All components consume tokens from `tokens.css`
- [ ] Barrel export at `components/ui/index.ts`
- [ ] Each component has its own `index.ts`
- [ ] Basic accessibility: `aria-*` attributes, visible focus ring, keyboard support
- [ ] Storybook running with `autodocs` enabled on all components
- [ ] Mobile-first: all base styles written without breakpoint prefix; `sm:` / `md:` used to enhance upward (see `docs/responsiveness.md`)

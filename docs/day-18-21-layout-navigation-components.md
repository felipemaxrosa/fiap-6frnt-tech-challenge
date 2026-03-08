# Day 18-21: Layout & Navigation Components

## Goals

- Build reusable layout and navigation components that frame the entire app
- Implement accessible modal with keyboard support (Escape key, focus management)
- Create feedback components: `EmptyState`, `LoadingSpinner`, `Skeleton`
- Document all components in Storybook with all variants

---

## Prerequisites

Before starting, confirm the following items from previous phases are ready:

- [ ] Design tokens (`tokens.css`) available and working in Storybook (Days 3-4)
- [ ] `lib/utils.ts` with `cn` helper (Days 8-10)
- [ ] `Button` component implemented and exported (Days 8-10)
- [ ] `components/ui/index.ts` barrel export in place (Days 8-10)
- [ ] `lucide-react` installed (`npm install lucide-react`)

---

## Expected folder structure at the end

```
components/
└── ui/
    ├── Header/
    │   ├── Header.tsx
    │   ├── Header.stories.tsx
    │   └── index.ts
    ├── Modal/
    │   ├── Modal.tsx
    │   ├── Modal.stories.tsx
    │   └── index.ts
    ├── EmptyState/
    │   ├── EmptyState.tsx
    │   ├── EmptyState.stories.tsx
    │   └── index.ts
    ├── LoadingSpinner/
    │   ├── LoadingSpinner.tsx
    │   ├── LoadingSpinner.stories.tsx
    │   └── index.ts
    └── Skeleton/
        ├── Skeleton.tsx
        ├── Skeleton.stories.tsx
        └── index.ts
```

---

## Component 1 — `Header`

Sticky top navigation bar with the app name and nav links. Collapses to a hamburger menu on mobile.

### Props

| Prop      | Type     | Default      | Description                   |
| --------- | -------- | ------------ | ----------------------------- |
| `appName` | `string` | `'FinTrack'` | App name displayed in the bar |

### TypeScript interface

```ts
export interface HeaderProps {
  appName?: string
}
```

### Suggested implementation

```tsx
// components/ui/Header/Header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface HeaderProps {
  appName?: string
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/transactions', label: 'Transactions' },
]

export function Header({ appName = 'FinTrack' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface shadow-card">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-primary">
          {appName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-6 sm:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="rounded-md p-2 text-text-secondary hover:bg-surface-hover sm:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-border bg-surface px-4 py-3 sm:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
```

### Responsive behavior

`Header` is the primary example of breakpoint-driven show/hide in this project. The desktop nav and mobile hamburger are mutually exclusive:

| Element              | Mobile (default)  | sm+ (640px+)   |
| -------------------- | ----------------- | -------------- |
| Desktop `<nav>`      | `hidden`          | `flex`         |
| Hamburger `<button>` | visible           | `hidden`       |
| Mobile `<nav>`       | toggled via state | never rendered |

The inner content is constrained by `max-w-5xl mx-auto` so it doesn't stretch on very wide screens.

### Storybook stories

```tsx
// components/ui/Header/Header.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Header } from './Header'

const meta: Meta<typeof Header> = {
  title: 'UI/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    // nextjs router is provided automatically by @storybook/nextjs-vite
    layout: 'fullscreen',
  },
}
export default meta
type Story = StoryObj<typeof Header>

export const Default: Story = {}

export const CustomAppName: Story = {
  args: { appName: 'MyFinances' },
}
```

---

## Component 2 — `Modal`

Accessible dialog overlay. Closes on Escape key or backdrop click. Renders via `createPortal` into `document.body` to avoid stacking context issues.

### Props

| Prop       | Type                   | Default     | Description                       |
| ---------- | ---------------------- | ----------- | --------------------------------- |
| `isOpen`   | `boolean`              | —           | Controls visibility               |
| `onClose`  | `() => void`           | —           | Called when modal should close    |
| `title`    | `string`               | `undefined` | Heading rendered inside the panel |
| `size`     | `'sm' \| 'md' \| 'lg'` | `'md'`      | Max-width of the modal panel      |
| `children` | `React.ReactNode`      | —           | Content rendered inside the panel |

### TypeScript interface

```ts
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}
```

### Suggested implementation

```tsx
// components/ui/Modal/Modal.tsx
'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

export function Modal({ isOpen, onClose, title, size = 'md', children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/50" aria-hidden="true" onClick={onClose} />

      {/* Panel */}
      <div
        className={cn('relative w-full rounded-xl bg-surface p-6 shadow-modal', sizeStyles[size])}
      >
        <div className="flex items-start justify-between gap-4">
          {title && (
            <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="ml-auto rounded-md p-1 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}
```

### Responsive behavior

`Modal` adapts to screen size via the combination of `w-full` on the panel and a `max-w-*` size variant. On mobile the `p-4` outer wrapper provides breathing room so the panel doesn't touch screen edges. Action buttons inside modals should stack vertically on small screens:

```tsx
{
  /* Stack on mobile, side by side on sm+ */
}
;<div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
  <Button variant="secondary" fullWidth onClick={onClose}>
    Cancel
  </Button>
  <Button fullWidth onClick={onClose}>
    Confirm
  </Button>
</div>
```

### Storybook stories

> `Modal` uses `createPortal` and stateful `isOpen`, so stories use a `render` function with local state.

```tsx
// components/ui/Modal/Modal.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm action">
          <p className="text-sm text-text-secondary">Are you sure you want to proceed?</p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </div>
        </Modal>
      </>
    )
  },
}

export const Small: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open SM</Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Small modal" size="sm">
          <p className="text-sm text-text-secondary">Small modal content.</p>
        </Modal>
      </>
    )
  },
}

export const Large: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open LG</Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Large modal" size="lg">
          <p className="text-sm text-text-secondary">Large modal with more space for content.</p>
        </Modal>
      </>
    )
  },
}

export const WithoutTitle: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open (no title)</Button>
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <p className="text-sm text-text-secondary">Modal without a header title.</p>
        </Modal>
      </>
    )
  },
}

export const DeleteConfirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete transaction
        </Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Delete transaction" size="sm">
          <p className="text-sm text-text-secondary">
            This action cannot be undone. The transaction will be permanently removed.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </div>
        </Modal>
      </>
    )
  },
}
```

---

## Component 3 — `EmptyState`

Centered placeholder shown when a list has no items to display. Accepts an icon, title, description, and an optional action button.

### Props

| Prop          | Type              | Default     | Description                     |
| ------------- | ----------------- | ----------- | ------------------------------- |
| `icon`        | `React.ReactNode` | `undefined` | Icon rendered above the title   |
| `title`       | `string`          | —           | Main message                    |
| `description` | `string`          | `undefined` | Supporting text below the title |
| `action`      | `React.ReactNode` | `undefined` | CTA button or link              |
| `className`   | `string`          | `undefined` | Extra classes for the wrapper   |

### TypeScript interface

```ts
export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}
```

### Suggested implementation

```tsx
// components/ui/EmptyState/EmptyState.tsx
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-4 py-16 text-center', className)}
    >
      {icon && <div className="text-text-muted">{icon}</div>}
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-text-primary">{title}</p>
        {description && <p className="text-sm text-text-secondary">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
```

### Responsive behavior

`EmptyState` is a centered flex column. It is responsive by default — the `py-16` vertical padding and `text-center` alignment work on all screen sizes. No breakpoint overrides needed.

### Storybook stories

```tsx
// components/ui/EmptyState/EmptyState.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ReceiptText, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof EmptyState>

export const NoTransactions: Story = {
  args: {
    icon: <ReceiptText size={48} />,
    title: 'No transactions yet',
    description: 'Add your first transaction to get started.',
    action: <Button>Add transaction</Button>,
  },
}

export const NoResults: Story = {
  args: {
    icon: <SearchX size={48} />,
    title: 'No results found',
    description: 'Try adjusting your filters or search term.',
  },
}

export const TitleOnly: Story = {
  args: { title: 'Nothing here yet.' },
}

export const WithoutAction: Story = {
  args: {
    icon: <ReceiptText size={48} />,
    title: 'No transactions found',
    description: 'This section is currently empty.',
  },
}
```

---

## Component 4 — `LoadingSpinner` & `Skeleton`

Two complementary loading feedback components. Use `LoadingSpinner` for full-section loading states and `Skeleton` for individual element placeholders.

### `LoadingSpinner` props

| Prop        | Type                   | Default        | Description                    |
| ----------- | ---------------------- | -------------- | ------------------------------ |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'`         | Size of the spinner icon       |
| `label`     | `string`               | `'Loading...'` | Screen-reader accessible label |
| `className` | `string`               | `undefined`    | Extra classes for the wrapper  |

### `Skeleton` props

| Prop        | Type     | Default     | Description                           |
| ----------- | -------- | ----------- | ------------------------------------- |
| `className` | `string` | `undefined` | Width, height, and shape via Tailwind |

### `SkeletonList` props

| Prop    | Type     | Default | Description                         |
| ------- | -------- | ------- | ----------------------------------- |
| `lines` | `number` | `3`     | Number of transaction row skeletons |

### TypeScript interfaces

```ts
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export interface SkeletonProps {
  className?: string
}

export interface SkeletonListProps {
  lines?: number
}
```

### Suggested implementation

```tsx
// components/ui/LoadingSpinner/LoadingSpinner.tsx
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

const sizeMap = { sm: 16, md: 24, lg: 36 }

export function LoadingSpinner({
  size = 'md',
  label = 'Loading...',
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('flex items-center justify-center gap-2', className)}
    >
      <Loader2 size={sizeMap[size]} className="animate-spin text-primary" />
      <span className="sr-only">{label}</span>
    </div>
  )
}
```

```tsx
// components/ui/LoadingSpinner/Skeleton.tsx
import { cn } from '@/lib/utils'

export interface SkeletonProps {
  className?: string
}

export interface SkeletonListProps {
  lines?: number
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={cn('animate-pulse rounded-md bg-gray-200', className)} />
  )
}

export function SkeletonList({ lines = 3 }: SkeletonListProps) {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}
```

### Storybook stories

```tsx
// components/ui/LoadingSpinner/LoadingSpinner.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LoadingSpinner } from './LoadingSpinner'

const meta: Meta<typeof LoadingSpinner> = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof LoadingSpinner>

export const Default: Story = {}
export const Small: Story = { args: { size: 'sm' } }
export const Medium: Story = { args: { size: 'md' } }
export const Large: Story = { args: { size: 'lg' } }

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <LoadingSpinner size="sm" />
      <LoadingSpinner size="md" />
      <LoadingSpinner size="lg" />
    </div>
  ),
}
```

---

### Responsive behavior

`LoadingSpinner` is a centered inline element. No breakpoint changes needed.

---

## Component 5 — `Skeleton`

Animated placeholder that matches the shape of real content while data is loading. `SkeletonList` renders multiple rows shaped like a `TransactionItem`.

### TypeScript interfaces

```ts
export interface SkeletonProps {
  className?: string
}

export interface SkeletonListProps {
  lines?: number
}
```

### Suggested implementation

```tsx
// components/ui/Skeleton/Skeleton.tsx
import { cn } from '@/lib/utils'

export interface SkeletonProps {
  className?: string
}

export interface SkeletonListProps {
  lines?: number
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={cn('animate-pulse rounded-md bg-gray-200', className)} />
  )
}

export function SkeletonList({ lines = 3 }: SkeletonListProps) {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}
```

### Responsive behavior

`Skeleton` and `SkeletonList` fill their parent width by default. `SkeletonList` uses `w-3/4` and `w-1/4` fractional widths so the placeholder proportions look correct on any screen size.

### Storybook stories

```tsx
// components/ui/Skeleton/Skeleton.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Skeleton, SkeletonList } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof Skeleton>

export const Single: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
}

export const TransactionList: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <SkeletonList lines={4} />
    </div>
  ),
}

export const BalanceCardSkeleton: Story = {
  render: () => (
    <div className="w-72 rounded-lg border border-border p-5">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-40" />
    </div>
  ),
}
```

---

## Export pattern

Each component has an `index.ts` for clean imports:

```ts
// components/ui/Header/index.ts
export { Header } from './Header'
export type { HeaderProps } from './Header'
```

```ts
// components/ui/Modal/index.ts
export { Modal } from './Modal'
export type { ModalProps } from './Modal'
```

```ts
// components/ui/EmptyState/index.ts
export { EmptyState } from './EmptyState'
export type { EmptyStateProps } from './EmptyState'
```

```ts
// components/ui/LoadingSpinner/index.ts
export { LoadingSpinner } from './LoadingSpinner'
export { Skeleton, SkeletonList } from './Skeleton'
export type { LoadingSpinnerProps, SkeletonProps, SkeletonListProps } from './LoadingSpinner'
```

Add all to the global barrel at `components/ui/index.ts`:

```ts
// components/ui/index.ts (append)
export * from './Header'
export * from './Modal'
export * from './EmptyState'
export * from './LoadingSpinner'
```

---

## Checklist

### Header

- [ ] App name links to `/`
- [ ] Desktop nav links to `/` and `/transactions`
- [ ] Mobile hamburger toggle shows/hides nav on small screens
- [ ] `aria-expanded` and `aria-controls` set on the toggle button
- [ ] Active link visually distinguishable (can be added with `usePathname`)
- [ ] Stories documented in Storybook (Default, CustomAppName)

### Modal

- [ ] Renders via `createPortal` into `document.body`
- [ ] Backdrop click calls `onClose`
- [ ] Escape key calls `onClose`
- [ ] `role="dialog"` and `aria-modal="true"` on the wrapper
- [ ] `aria-labelledby` wired to the title element when `title` is provided
- [ ] Close button has descriptive `aria-label`
- [ ] Size variants: `sm`, `md`, `lg`
- [ ] Stories documented in Storybook (Default, Small, Large, WithoutTitle, DeleteConfirmation)

### EmptyState

- [ ] Renders icon, title, description, and action independently (all optional except `title`)
- [ ] Visually centered with consistent vertical spacing
- [ ] Stories documented in Storybook (NoTransactions, NoResults, TitleOnly, WithoutAction)

### LoadingSpinner

- [ ] `role="status"` and `aria-label` for screen readers
- [ ] `sr-only` span with label text
- [ ] Size variants: `sm`, `md`, `lg`
- [ ] Stories documented in Storybook (Sizes, SkeletonSingle, SkeletonTransactionList)

### Skeleton / SkeletonList

- [ ] `aria-hidden="true"` — decorative only, not read by screen readers
- [ ] `SkeletonList` mirrors the shape of a real `TransactionItem` row
- [ ] `animate-pulse` applied for visual feedback

### General

- [ ] All components consume tokens from `tokens.css` via Tailwind utilities
- [ ] Barrel exports updated in `components/ui/index.ts`
- [ ] Each component has its own `index.ts`
- [ ] Basic accessibility: `aria-*` attributes, keyboard support, focus visible ring
- [ ] Storybook running with `autodocs` enabled on all components
- [ ] Mobile-first: `Header` uses `hidden sm:flex` / `sm:hidden` for nav vs. hamburger; `Modal` actions use `flex-col sm:flex-row` to stack on mobile (see `docs/responsiveness.md`)

# Day 18-21: Layout & Navigation Components

## Goals

- Build reusable layout and navigation components that frame the entire app
- Create feedback components: `EmptyState` and `Skeleton`
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
    ├── EmptyState/
    │   ├── EmptyState.tsx
    │   ├── EmptyState.stories.tsx
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

## Component 2 — `EmptyState`

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

## Component 3 — `Skeleton`

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
// components/ui/EmptyState/index.ts
export { EmptyState } from './EmptyState'
export type { EmptyStateProps } from './EmptyState'
```

```ts
// components/ui/Skeleton/index.ts
export { Skeleton, SkeletonList } from './Skeleton'
export type { SkeletonProps, SkeletonListProps } from './Skeleton'
```

Add all to the global barrel at `components/ui/index.ts`:

```ts
// components/ui/index.ts (append)
export * from './Header'
export * from './EmptyState'
export * from './Skeleton'
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

### EmptyState

- [ ] Renders icon, title, description, and action independently (all optional except `title`)
- [ ] Visually centered with consistent vertical spacing
- [ ] Stories documented in Storybook (NoTransactions, NoResults, TitleOnly, WithoutAction)

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
- [ ] Mobile-first: `Header` uses `hidden sm:flex` / `sm:hidden` for nav vs. hamburger (see `docs/responsiveness.md`)

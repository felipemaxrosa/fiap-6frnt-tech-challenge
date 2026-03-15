# Day 18-21: Layout & Navigation Components

## Goals

- Build reusable layout and navigation components that frame the entire app
- Create feedback components: `EmptyState` and `Skeleton`
- Document all components in Storybook with all variants

---

## Prerequisites

Before starting, confirm the following items from previous phases are ready:

- [ ] Design tokens (`tokens.css`) applied and working in Storybook (Days 3-4)
- [ ] `lib/utils.ts` with `cn` helper (Days 8-10)
- [ ] `Button` component implemented and exported (Days 8-10)
- [ ] `components/ui/index.ts` barrel export in place (Days 8-10)
- [ ] `lucide-react` installed (`npm install lucide-react`)
- [ ] Bytebank logo exported as SVG to `public/logo.svg`

---

## Layout structure (Figma reference)

```
┌─────────────────────── Header (bg-brand-dark) ─────────────────────────┐
│  [Logo]                                   [User name] [Avatar icon]     │
└─────────────────────────────────────────────────────────────────────────┘

Mobile (< sm):                    Tablet (sm–lg):
  Header + hamburger drawer         Header
  (nav hidden in sidebar drawer)    [Início] [Transferências] [Investimentos] [Outros Serviços]
                                    [Main content — full width]

Desktop (lg+):
  Header
  [Sidebar nav (vertical)] | [Main content]
```

---

## Expected folder structure at the end

```
components/
└── ui/
    ├── Header/
    │   ├── Header.tsx
    │   ├── Header.stories.tsx
    │   └── index.ts
    ├── Sidebar/
    │   ├── Sidebar.tsx
    │   ├── Sidebar.stories.tsx
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

Sticky top bar with the Bytebank logo and user info. On mobile it adds a hamburger button that opens a full-height nav drawer.

> **Note:** The Header does NOT contain nav links. Navigation is handled by the `Sidebar` component.

### Props

| Prop       | Type     | Default                     | Description                         |
| ---------- | -------- | --------------------------- | ----------------------------------- |
| `userName` | `string` | `'Joana da Silva Oliveira'` | User name shown on tablet and above |

### TypeScript interface

```ts
export interface HeaderProps {
  userName?: string;
}
```

### Suggested implementation

```tsx
// components/ui/Header/Header.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, UserCircle } from 'lucide-react';
import { Sidebar } from '@/components/ui/Sidebar';

export interface HeaderProps {
  userName?: string;
}

export function Header({ userName = 'Joana da Silva Oliveira' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-brand-dark">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-lg">
          {/* Logo */}
          <Link href="/" aria-label="Bytebank — página inicial">
            <Image src="/logo.svg" alt="Bytebank" width={120} height={32} priority />
          </Link>

          {/* User info — tablet and above */}
          <div className="hidden sm:flex items-center gap-sm text-content-inverse">
            <span className="label-default">{userName}</span>
            <UserCircle size={32} aria-hidden="true" />
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="sm:hidden rounded-default p-sm text-content-inverse"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-16 z-30 bg-brand-dark sm:hidden"
          role="dialog"
          aria-label="Menu de navegação"
        >
          <Sidebar onLinkClick={() => setMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
```

### Responsive behavior

| Element       | Mobile (default)  | sm+ (640px+)   |
| ------------- | ----------------- | -------------- |
| User info     | `hidden`          | `flex`         |
| Hamburger     | visible           | `hidden`       |
| Mobile drawer | toggled via state | never rendered |

### Storybook stories

```tsx
// components/ui/Header/Header.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'UI/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const CustomUser: Story = {
  args: { userName: 'Felipe Rosa' },
};
```

---

## Component 2 — `Sidebar`

Responsive navigation component. Renders as a full-height drawer on mobile (controlled by `Header`), a horizontal tab bar on tablet, and a vertical left sidebar on desktop.

### Nav links

```ts
const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/transferencias', label: 'Transferências' },
  { href: '/investimentos', label: 'Investimentos' },
  { href: '/outros-servicos', label: 'Outros Serviços' },
];
```

### Props

| Prop          | Type         | Default     | Description                                           |
| ------------- | ------------ | ----------- | ----------------------------------------------------- |
| `onLinkClick` | `() => void` | `undefined` | Callback when a link is clicked (mobile drawer close) |

### TypeScript interface

```ts
export interface SidebarProps {
  onLinkClick?: () => void;
}
```

### Suggested implementation

```tsx
// components/ui/Sidebar/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  onLinkClick?: () => void;
}

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/transferencias', label: 'Transferências' },
  { href: '/investimentos', label: 'Investimentos' },
  { href: '/outros-servicos', label: 'Outros Serviços' },
];

export function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal">
      {/* Mobile: vertical list (rendered inside Header drawer) */}
      <ul className="flex flex-col gap-xs px-lg py-lg sm:hidden">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                'block rounded-default px-md py-sm label-default',
                pathname === link.href
                  ? 'bg-surface text-content-primary font-semibold'
                  : 'text-content-inverse hover:text-content-inverse/80'
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Tablet: horizontal tab bar */}
      <ul className="hidden sm:flex lg:hidden gap-xs px-lg py-sm">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'block rounded-default px-md py-sm label-default',
                pathname === link.href
                  ? 'bg-surface text-content-primary font-semibold shadow-card'
                  : 'text-content-secondary hover:text-content-primary'
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop: vertical sidebar */}
      <ul className="hidden lg:flex flex-col gap-xs pt-lg">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'block rounded-default px-md py-sm label-default',
                pathname === link.href
                  ? 'bg-surface text-content-primary font-semibold shadow-card'
                  : 'text-content-secondary hover:text-content-primary'
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### Layout integration

The `Sidebar` must be placed inside a layout shell that positions it correctly per breakpoint:

```tsx
// app/layout.tsx (simplified)
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />

        {/* Tablet: horizontal nav (full width, above content) */}
        <div className="hidden sm:block lg:hidden bg-background border-b border-border">
          <div className="mx-auto max-w-[1200px]">
            <Sidebar />
          </div>
        </div>

        {/* Desktop + content area */}
        <div className="mx-auto flex max-w-[1200px] px-lg gap-lg">
          {/* Desktop: vertical sidebar */}
          <div className="hidden lg:block w-48 shrink-0">
            <Sidebar />
          </div>

          <main className="flex-1 py-lg">{children}</main>
        </div>
      </body>
    </html>
  );
}
```

### Responsive behavior

| Breakpoint    | Nav style        | Position                 |
| ------------- | ---------------- | ------------------------ |
| Mobile (<sm)  | Vertical list    | Header drawer overlay    |
| Tablet (sm)   | Horizontal tabs  | Below header, full width |
| Desktop (lg+) | Vertical sidebar | Left of main content     |

### Storybook stories

```tsx
// components/ui/Sidebar/Sidebar.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'UI/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

export const TabletHorizontal: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

export const DesktopVertical: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};
```

---

## Component 3 — `EmptyState`

Centered placeholder shown when a list has no items to display.

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
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}
```

### Suggested implementation

```tsx
// components/ui/EmptyState/EmptyState.tsx
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-md py-16 text-center',
        className
      )}
    >
      {icon && <div className="text-content-secondary">{icon}</div>}
      <div className="flex flex-col gap-xs">
        <p className="body-semibold text-content-primary">{title}</p>
        {description && <p className="label-default text-content-secondary">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
```

### Storybook stories

```tsx
// components/ui/EmptyState/EmptyState.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ReceiptText, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoTransactions: Story = {
  args: {
    icon: <ReceiptText size={48} />,
    title: 'Nenhuma transação encontrada',
    description: 'Adicione sua primeira transação para começar.',
    action: <Button>Nova transação</Button>,
  },
};

export const NoResults: Story = {
  args: {
    icon: <SearchX size={48} />,
    title: 'Nenhum resultado',
    description: 'Tente ajustar os filtros.',
  },
};

export const TitleOnly: Story = {
  args: { title: 'Nada por aqui ainda.' },
};
```

---

## Component 4 — `Skeleton`

Animated placeholder that matches the shape of real content while data is loading.

### TypeScript interfaces

```ts
export interface SkeletonProps {
  className?: string;
}

export interface SkeletonListProps {
  lines?: number;
}
```

### Suggested implementation

```tsx
// components/ui/Skeleton/Skeleton.tsx
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
}

export interface SkeletonListProps {
  lines?: number;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={cn('animate-pulse rounded-default bg-border', className)} />
  );
}

export function SkeletonList({ lines = 3 }: SkeletonListProps) {
  return (
    <div className="flex flex-col gap-sm" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-sm rounded-default border border-border bg-surface px-md py-sm"
        >
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="flex flex-1 flex-col gap-xs">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
```

### Storybook stories

```tsx
// components/ui/Skeleton/Skeleton.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Skeleton, SkeletonList } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Single: Story = {
  render: () => (
    <div className="flex flex-col gap-sm w-64">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
};

export const TransactionList: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <SkeletonList lines={4} />
    </div>
  ),
};

export const BalanceCardSkeleton: Story = {
  render: () => (
    <div className="w-72 rounded-default border border-border bg-surface p-lg shadow-card">
      <Skeleton className="h-3 w-24 mb-sm" />
      <Skeleton className="h-8 w-40" />
    </div>
  ),
};
```

---

## Export pattern

```ts
// components/ui/Header/index.ts
export { Header } from './Header';
export type { HeaderProps } from './Header';
```

```ts
// components/ui/Sidebar/index.ts
export { Sidebar } from './Sidebar';
export type { SidebarProps } from './Sidebar';
```

```ts
// components/ui/EmptyState/index.ts
export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';
```

```ts
// components/ui/Skeleton/index.ts
export { Skeleton, SkeletonList } from './Skeleton';
export type { SkeletonProps, SkeletonListProps } from './Skeleton';
```

Append to `components/ui/index.ts`:

```ts
export * from './Header';
export * from './Sidebar';
export * from './EmptyState';
export * from './Skeleton';
```

---

## Checklist

### Header

- [ ] Logo renders `public/logo.svg` via `next/image`
- [ ] Background uses `bg-brand-dark` token
- [ ] User name + `UserCircle` icon visible on `sm+`, hidden on mobile
- [ ] Hamburger visible on mobile (`sm:hidden`), opens `Sidebar` drawer overlay
- [ ] `aria-expanded` and `aria-controls` set on hamburger button
- [ ] Stories: Default, CustomUser

### Sidebar

- [ ] Mobile: vertical list inside Header's drawer overlay
- [ ] Tablet (`sm`–`lg`): horizontal tab bar below Header
- [ ] Desktop (`lg+`): vertical left sidebar
- [ ] Active link: `bg-surface text-content-primary font-semibold shadow-card`
- [ ] Inactive link: `text-content-secondary hover:text-content-primary`
- [ ] Active state driven by `usePathname()`
- [ ] Stories: TabletHorizontal, DesktopVertical

### EmptyState

- [ ] Renders icon, title, description, and action independently
- [ ] Uses DS tokens: `text-content-primary`, `text-content-secondary`
- [ ] Uses semantic classes: `body-semibold`, `label-default`
- [ ] Stories: NoTransactions, NoResults, TitleOnly

### Skeleton / SkeletonList

- [ ] `aria-hidden="true"` on all skeleton elements
- [ ] Uses `bg-border` token (not hardcoded `bg-gray-200`)
- [ ] Uses `rounded-default`, `border-border`, `bg-surface`, `gap-sm` tokens
- [ ] `SkeletonList` mirrors the shape of a real `TransactionItem` row
- [ ] Stories: Single, TransactionList, BalanceCardSkeleton

### General

- [ ] All components use DS tokens from `tokens.css` — no hardcoded colors, spacing, or radius
- [ ] Barrel exports updated in `components/ui/index.ts`
- [ ] Each component has its own `index.ts`
- [ ] Basic accessibility: `aria-*` attributes, keyboard support, `:focus-visible` ring
- [ ] Max content width: `max-w-[1200px]` (Figma spec)

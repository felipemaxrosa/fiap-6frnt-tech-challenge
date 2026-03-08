# Day 14-17: Data Display Components

## Goals

- Build the data display feature components that connect real transaction data to the UI
- Reuse atomic components from `components/ui/` (`Card`, `Badge`, `Button`)
- Consume `useTransactions()` and `TRANSACTION_TYPE` where needed
- Document all components in Storybook with all variants

---

## Prerequisites

Before starting, confirm the following are ready:

- [ ] `components/ui/Card`, `Badge`, `Button` implemented (Days 8-10)
- [ ] `types/index.ts` with `Transaction`, `TransactionType` defined (Days 5-7)
- [ ] `shared/constants/transaction.ts` with `TRANSACTION_TYPE` (Days 5-7)
- [ ] `context/TransactionsContext.tsx` with `useTransactions()` hook (Days 5-7)
- [ ] `lib/utils.ts` with `cn` helper (Days 8-10)
- [ ] `json-server` installed and `npm run api` running on port 3001 (Days 5-7)
- [ ] `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3001` (Days 5-7)

> Both `npm run dev` and `npm run api` must be running concurrently during development. Use two terminal tabs.

---

## Expected folder structure at the end

```
components/
└── features/
    ├── TransactionItem/
    │   ├── TransactionItem.tsx
    │   ├── TransactionItem.stories.tsx
    │   └── index.ts
    ├── TransactionList/
    │   ├── TransactionList.tsx
    │   ├── TransactionList.stories.tsx
    │   └── index.ts
    ├── BalanceCard/
    │   ├── BalanceCard.tsx
    │   ├── BalanceCard.stories.tsx
    │   └── index.ts
    └── TransactionSummary/
        ├── TransactionSummary.tsx
        ├── TransactionSummary.stories.tsx
        └── index.ts
```

---

## Component 1 — `TransactionItem`

Single transaction row displaying the type badge, description, date, amount, and action buttons.

### Props

| Prop          | Type                   | Default     | Description                              |
| ------------- | ---------------------- | ----------- | ---------------------------------------- |
| `transaction` | `Transaction`          | —           | The transaction data object              |
| `onEdit`      | `(id: string) => void` | `undefined` | Called when the Edit button is clicked   |
| `onDelete`    | `(id: string) => void` | `undefined` | Called when the Delete button is clicked |

### TypeScript interface

```ts
// components/features/TransactionItem/TransactionItem.tsx
import type { Transaction } from '@/types'

export interface TransactionItemProps {
  transaction: Transaction
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}
```

### Suggested implementation

```tsx
// components/features/TransactionItem/TransactionItem.tsx
'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TRANSACTION_TYPE } from '@/shared/constants/transaction'
import { cn } from '@/lib/utils'
import type { Transaction, TransactionType } from '@/types'

export interface TransactionItemProps {
  transaction: Transaction
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const badgeVariantMap: Record<TransactionType, 'income' | 'expense' | 'transfer'> = {
  [TRANSACTION_TYPE.DEPOSIT]: 'income',
  [TRANSACTION_TYPE.WITHDRAWAL]: 'expense',
  [TRANSACTION_TYPE.TRANSFER]: 'transfer',
}

const amountColorMap: Record<TransactionType, string> = {
  [TRANSACTION_TYPE.DEPOSIT]: 'text-income',
  [TRANSACTION_TYPE.WITHDRAWAL]: 'text-expense',
  [TRANSACTION_TYPE.TRANSFER]: 'text-transfer',
}

const amountPrefixMap: Record<TransactionType, string> = {
  [TRANSACTION_TYPE.DEPOSIT]: '+',
  [TRANSACTION_TYPE.WITHDRAWAL]: '-',
  [TRANSACTION_TYPE.TRANSFER]: '↔',
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('pt-BR')
}

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const { id, type, description, amount, date } = transaction

  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-center gap-3 min-w-0">
        <Badge variant={badgeVariantMap[type]} dot size="sm">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text-primary">{description}</p>
          <p className="text-xs text-text-secondary">{formatDate(date)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={cn('text-sm font-semibold', amountColorMap[type])}>
          {amountPrefixMap[type]} {formatCurrency(amount)}
        </span>

        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Pencil size={14} />}
            aria-label={`Edit transaction: ${description}`}
            onClick={() => onEdit(id)}
          />
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 size={14} />}
            aria-label={`Delete transaction: ${description}`}
            onClick={() => onDelete(id)}
          />
        )}
      </div>
    </li>
  )
}
```

### Responsive behavior

`TransactionItem` is a `flex` row with `min-w-0` on the text area and `shrink-0` on the actions. This keeps the amount and action buttons from being squeezed on small screens while letting the description truncate gracefully. No breakpoint overrides are needed on the component itself.

### Storybook stories

```tsx
// components/features/TransactionItem/TransactionItem.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TransactionItem } from './TransactionItem'
import { TRANSACTION_TYPE } from '@/shared/constants/transaction'

const meta: Meta<typeof TransactionItem> = {
  title: 'Features/TransactionItem',
  component: TransactionItem,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof TransactionItem>

const base = { id: 'txn-001', date: '2025-03-08', amount: 500 }

export const Deposit: Story = {
  args: {
    transaction: { ...base, type: TRANSACTION_TYPE.DEPOSIT, description: 'March salary' },
    onEdit: (id) => console.log('edit', id),
    onDelete: (id) => console.log('delete', id),
  },
}

export const Withdrawal: Story = {
  args: {
    transaction: { ...base, type: TRANSACTION_TYPE.WITHDRAWAL, description: 'Supermarket' },
    onEdit: (id) => console.log('edit', id),
    onDelete: (id) => console.log('delete', id),
  },
}

export const Transfer: Story = {
  args: {
    transaction: { ...base, type: TRANSACTION_TYPE.TRANSFER, description: 'Transfer to savings' },
    onEdit: (id) => console.log('edit', id),
    onDelete: (id) => console.log('delete', id),
  },
}

export const WithoutActions: Story = {
  args: {
    transaction: { ...base, type: TRANSACTION_TYPE.DEPOSIT, description: 'Read-only entry' },
  },
}

export const LongDescription: Story = {
  args: {
    transaction: {
      ...base,
      type: TRANSACTION_TYPE.WITHDRAWAL,
      description:
        'Very long transaction description that should truncate gracefully on smaller screens',
    },
    onEdit: (id) => console.log('edit', id),
    onDelete: (id) => console.log('delete', id),
  },
}
```

---

## Component 2 — `TransactionList`

Ordered list of `TransactionItem`s. Renders an empty state when there are no transactions.

### Props

| Prop           | Type                   | Default                    | Description                         |
| -------------- | ---------------------- | -------------------------- | ----------------------------------- |
| `transactions` | `Transaction[]`        | —                          | Array of transactions to display    |
| `onEdit`       | `(id: string) => void` | `undefined`                | Forwarded to each `TransactionItem` |
| `onDelete`     | `(id: string) => void` | `undefined`                | Forwarded to each `TransactionItem` |
| `emptyMessage` | `string`               | `'No transactions found.'` | Text shown when the list is empty   |

### TypeScript interface

```ts
export interface TransactionListProps {
  transactions: Transaction[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  emptyMessage?: string
}
```

### Suggested implementation

```tsx
// components/features/TransactionList/TransactionList.tsx
import { ReceiptText } from 'lucide-react'
import { TransactionItem } from '@/components/features/TransactionItem'
import type { Transaction } from '@/types'

export interface TransactionListProps {
  transactions: Transaction[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  emptyMessage?: string
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
  emptyMessage = 'No transactions found.',
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface py-16 text-text-secondary">
        <ReceiptText size={32} className="text-text-muted" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
```

### Responsive behavior

`TransactionList` is a vertical flex stack. It is full-width by default and adapts naturally to any screen size since each row handles its own internal layout. No breakpoint overrides needed.

### Storybook stories

```tsx
// components/features/TransactionList/TransactionList.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TransactionList } from './TransactionList'
import { TRANSACTION_TYPE } from '@/shared/constants/transaction'
import type { Transaction } from '@/types'

const meta: Meta<typeof TransactionList> = {
  title: 'Features/TransactionList',
  component: TransactionList,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof TransactionList>

const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    type: TRANSACTION_TYPE.DEPOSIT,
    amount: 5000,
    date: '2025-03-05',
    description: 'March salary',
  },
  {
    id: 'txn-002',
    type: TRANSACTION_TYPE.WITHDRAWAL,
    amount: 120.5,
    date: '2025-03-07',
    description: 'Supermarket',
  },
  {
    id: 'txn-003',
    type: TRANSACTION_TYPE.TRANSFER,
    amount: 800,
    date: '2025-03-10',
    description: 'Rent payment',
  },
  {
    id: 'txn-004',
    type: TRANSACTION_TYPE.WITHDRAWAL,
    amount: 45,
    date: '2025-03-12',
    description: 'Streaming services',
  },
]

export const Default: Story = {
  args: {
    transactions: mockTransactions,
    onEdit: (id) => console.log('edit', id),
    onDelete: (id) => console.log('delete', id),
  },
}

export const Empty: Story = {
  args: { transactions: [] },
}

export const EmptyWithCustomMessage: Story = {
  args: { transactions: [], emptyMessage: 'No transactions match your filters.' },
}

export const ReadOnly: Story = {
  args: { transactions: mockTransactions },
}
```

---

## Component 3 — `BalanceCard`

Displays the current account balance prominently. Used on the Home page.

### Props

| Prop      | Type     | Default             | Description                     |
| --------- | -------- | ------------------- | ------------------------------- |
| `balance` | `number` | —                   | Current account balance         |
| `owner`   | `string` | `undefined`         | Optional account owner name     |
| `label`   | `string` | `'Current balance'` | Subtitle label above the amount |

### TypeScript interface

```ts
export interface BalanceCardProps {
  balance: number
  owner?: string
  label?: string
}
```

### Suggested implementation

```tsx
// components/features/BalanceCard/BalanceCard.tsx
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface BalanceCardProps {
  balance: number
  owner?: string
  label?: string
}

export function BalanceCard({ balance, owner, label = 'Current balance' }: BalanceCardProps) {
  const isPositive = balance >= 0

  return (
    <Card padding="lg" className="bg-primary text-text-inverse border-0 shadow-modal">
      {owner && <p className="mb-1 text-sm font-medium opacity-75">Welcome, {owner}</p>}
      <p className="text-sm font-medium opacity-75">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        {isPositive ? (
          <TrendingUp size={28} className="opacity-80" />
        ) : (
          <TrendingDown size={28} className="opacity-80" />
        )}
        <span className={cn('text-3xl font-bold tracking-tight', !isPositive && 'text-red-200')}>
          {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>
    </Card>
  )
}
```

### Responsive behavior

`BalanceCard` fills its parent by default. On mobile the balance amount can be `text-2xl` and grow to `text-3xl` on `md+` for better visual hierarchy:

```tsx
<span
  className={cn('text-2xl font-bold tracking-tight md:text-3xl', !isPositive && 'text-red-200')}
>
  {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
</span>
```

### Storybook stories

```tsx
// components/features/BalanceCard/BalanceCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BalanceCard } from './BalanceCard'

const meta: Meta<typeof BalanceCard> = {
  title: 'Features/BalanceCard',
  component: BalanceCard,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'page' },
  },
}
export default meta
type Story = StoryObj<typeof BalanceCard>

export const Positive: Story = {
  args: { balance: 8420.5, owner: 'Felipe' },
}

export const Negative: Story = {
  args: { balance: -350.0, label: 'Current balance' },
}

export const Zero: Story = {
  args: { balance: 0 },
}

export const WithoutOwner: Story = {
  args: { balance: 3200.75 },
}

export const CustomLabel: Story = {
  args: { balance: 15000, label: 'Available balance' },
}
```

---

## Component 4 — `TransactionSummary`

Shows the totals broken down by transaction type: total deposited, total withdrawn, and total transferred.

### Props

| Prop           | Type            | Default | Description                            |
| -------------- | --------------- | ------- | -------------------------------------- |
| `transactions` | `Transaction[]` | —       | Full list used to calculate each total |

### TypeScript interface

```ts
export interface TransactionSummaryProps {
  transactions: Transaction[]
}
```

### Suggested implementation

```tsx
// components/features/TransactionSummary/TransactionSummary.tsx
import { ArrowDownCircle, ArrowUpCircle, ArrowRightLeft } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { TRANSACTION_TYPE } from '@/shared/constants/transaction'
import type { Transaction } from '@/types'

export interface TransactionSummaryProps {
  transactions: Transaction[]
}

function sumByType(transactions: Transaction[], type: string): number {
  return transactions.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0)
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function TransactionSummary({ transactions }: TransactionSummaryProps) {
  const totalDeposited = sumByType(transactions, TRANSACTION_TYPE.DEPOSIT)
  const totalWithdrawn = sumByType(transactions, TRANSACTION_TYPE.WITHDRAWAL)
  const totalTransferred = sumByType(transactions, TRANSACTION_TYPE.TRANSFER)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card padding="md" className="flex items-center gap-3">
        <ArrowUpCircle size={32} className="shrink-0 text-income" />
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            Deposited
          </p>
          <p className="text-lg font-bold text-income">{formatCurrency(totalDeposited)}</p>
        </div>
      </Card>

      <Card padding="md" className="flex items-center gap-3">
        <ArrowDownCircle size={32} className="shrink-0 text-expense" />
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            Withdrawn
          </p>
          <p className="text-lg font-bold text-expense">{formatCurrency(totalWithdrawn)}</p>
        </div>
      </Card>

      <Card padding="md" className="flex items-center gap-3">
        <ArrowRightLeft size={32} className="shrink-0 text-transfer" />
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            Transferred
          </p>
          <p className="text-lg font-bold text-transfer">{formatCurrency(totalTransferred)}</p>
        </div>
      </Card>
    </div>
  )
}
```

### Responsive behavior

`TransactionSummary` is the primary example of responsive grid layout in this project. The implementation already follows mobile-first:

```tsx
<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
  {/* 1 column on mobile → 3 columns from 640px onward */}
</div>
```

This is the canonical pattern to reuse for any multi-stat grid in the app.

### Storybook stories

```tsx
// components/features/TransactionSummary/TransactionSummary.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TransactionSummary } from './TransactionSummary'
import { TRANSACTION_TYPE } from '@/shared/constants/transaction'
import type { Transaction } from '@/types'

const meta: Meta<typeof TransactionSummary> = {
  title: 'Features/TransactionSummary',
  component: TransactionSummary,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'page' },
  },
}
export default meta
type Story = StoryObj<typeof TransactionSummary>

const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    type: TRANSACTION_TYPE.DEPOSIT,
    amount: 5000,
    date: '2025-03-05',
    description: 'March salary',
  },
  {
    id: 'txn-002',
    type: TRANSACTION_TYPE.DEPOSIT,
    amount: 350,
    date: '2025-03-15',
    description: 'Freelance',
  },
  {
    id: 'txn-003',
    type: TRANSACTION_TYPE.WITHDRAWAL,
    amount: 120.5,
    date: '2025-03-07',
    description: 'Supermarket',
  },
  {
    id: 'txn-004',
    type: TRANSACTION_TYPE.WITHDRAWAL,
    amount: 45,
    date: '2025-03-12',
    description: 'Streaming',
  },
  {
    id: 'txn-005',
    type: TRANSACTION_TYPE.TRANSFER,
    amount: 800,
    date: '2025-03-10',
    description: 'Rent',
  },
]

export const Default: Story = {
  args: { transactions: mockTransactions },
}

export const AllZero: Story = {
  args: { transactions: [] },
}

export const OnlyDeposits: Story = {
  args: {
    transactions: mockTransactions.filter((t) => t.type === TRANSACTION_TYPE.DEPOSIT),
  },
}
```

---

## Export pattern

Each component has an `index.ts` for clean imports:

```ts
// components/features/TransactionItem/index.ts
export { TransactionItem } from './TransactionItem'
export type { TransactionItemProps } from './TransactionItem'
```

```ts
// components/features/TransactionList/index.ts
export { TransactionList } from './TransactionList'
export type { TransactionListProps } from './TransactionList'
```

```ts
// components/features/BalanceCard/index.ts
export { BalanceCard } from './BalanceCard'
export type { BalanceCardProps } from './BalanceCard'
```

```ts
// components/features/TransactionSummary/index.ts
export { TransactionSummary } from './TransactionSummary'
export type { TransactionSummaryProps } from './TransactionSummary'
```

And a global barrel at `components/features/index.ts`:

```ts
// components/features/index.ts
export * from './TransactionItem'
export * from './TransactionList'
export * from './BalanceCard'
export * from './TransactionSummary'
```

---

## Checklist

### TransactionItem

- [ ] Displays type badge using `Badge` from `components/ui`
- [ ] Amount color and prefix reflect transaction type via `TRANSACTION_TYPE`
- [ ] Description truncates gracefully on small screens
- [ ] Date formatted to `pt-BR` locale
- [ ] `onEdit` and `onDelete` callbacks render action buttons when provided
- [ ] `aria-label` on action buttons for accessibility
- [ ] Stories documented in Storybook (Deposit, Withdrawal, Transfer, WithoutActions, LongDescription)

### TransactionList

- [ ] Renders a `TransactionItem` for each transaction
- [ ] Shows empty state with icon and configurable message when list is empty
- [ ] Forwards `onEdit` and `onDelete` to each item
- [ ] Stories documented in Storybook (Default, Empty, EmptyWithCustomMessage, ReadOnly)

### BalanceCard

- [ ] Displays balance formatted to `pt-BR` currency
- [ ] Shows trending icon based on positive/negative balance
- [ ] Negative balance renders with distinct color
- [ ] Optional `owner` name renders a welcome message
- [ ] Stories documented in Storybook (Positive, Negative, Zero, WithoutOwner, CustomLabel)

### TransactionSummary

- [ ] Calculates totals per type using `TRANSACTION_TYPE` constants
- [ ] Three cards: Deposited, Withdrawn, Transferred
- [ ] Each card shows correct color and icon per type
- [ ] Responsive grid: 1 column on mobile, 3 columns on `sm` and up
- [ ] Stories documented in Storybook (Default, AllZero, OnlyDeposits)

### General

- [ ] All components consume tokens from `tokens.css` via Tailwind utilities
- [ ] Barrel export at `components/features/index.ts`
- [ ] Each component has its own `index.ts`
- [ ] `TRANSACTION_TYPE` used everywhere instead of raw string literals
- [ ] Storybook stories use hardcoded mock arrays (no json-server dependency in Storybook)
- [ ] When wiring `onEdit`/`onDelete` in pages, use `async` handlers from `useTransactions()` (e.g. `onDelete={async (id) => { await deleteTransaction(id) }}`)
- [ ] Storybook running with `autodocs` enabled on all components
- [ ] Mobile-first: `TransactionSummary` uses `grid-cols-1 sm:grid-cols-3`; `BalanceCard` uses `text-2xl md:text-3xl` for the balance amount (see `docs/responsiveness.md`)

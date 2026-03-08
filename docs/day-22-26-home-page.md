# Day 22-26: Home Page

## Goals

- Implement the Home page connecting real context data to the UI components built in Phase 2
- Display the current account balance using `BalanceCard`
- Show the 5 most recent transactions using `TransactionList`
- Provide a quick-add shortcut that opens the `TransactionForm` modal
- Deliver a fully responsive layout that works on mobile and desktop

---

## Prerequisites

Before starting, confirm all of the following are ready:

- [ ] `BalanceCard` implemented and exported (Days 14-17)
- [ ] `TransactionList` and `TransactionItem` implemented and exported (Days 14-17)
- [ ] `TransactionSummary` implemented and exported (Days 14-17)
- [ ] `Header` component implemented and registered in `app/layout.tsx` (Days 18-21)
- [ ] `Modal` component implemented and exported (Days 18-21)
- [ ] `LoadingSpinner` and `Skeleton` / `SkeletonList` implemented (Days 18-21)
- [ ] `EmptyState` implemented and exported (Days 18-21)
- [ ] `TransactionsProvider` registered in `app/layout.tsx` (Days 5-7)
- [ ] `useTransactions()` returns `{ transactions, balance, recentTransactions, isLoading, addTransaction }` (Days 5-7)
- [ ] `json-server` running on port 3001 (`npm run api`) alongside `npm run dev`

---

## Expected file structure at the end

```
app/
└── page.tsx                          # Home page (this phase)

components/
└── features/
    └── TransactionForm/
        ├── TransactionForm.tsx        # Add/edit form (built in this phase)
        ├── TransactionForm.stories.tsx
        └── index.ts
```

> `TransactionForm` is introduced here because the quick-add shortcut on the Home page needs it. The same component will be reused on the Edit flow in Days 37-40.

---

## Step 1 — Build `TransactionForm`

### Purpose

A controlled form that collects the three required fields for a new transaction: type, amount, and date — plus an optional description. On submit it calls `addTransaction` from the context and closes the modal. This same component will be reused with pre-populated values for the edit flow.

### Props

| Prop            | Type                      | Default     | Description                                  |
| --------------- | ------------------------- | ----------- | -------------------------------------------- |
| `onSuccess`     | `() => void`              | —           | Called after a successful submit             |
| `onCancel`      | `() => void`              | —           | Called when the user cancels                 |
| `initialValues` | `Partial<NewTransaction>` | `undefined` | Pre-populates the form for the edit use case |

### TypeScript interface

```ts
// components/features/TransactionForm/types.ts
import type { NewTransaction } from '@/types'

export interface TransactionFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialValues?: Partial<NewTransaction>
}
```

### Install form dependencies

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Zod schema

```ts
// components/features/TransactionForm/schema.ts
import { z } from 'zod'
import { TRANSACTION_TYPE } from '@/shared/constants/transaction'

export const transactionSchema = z.object({
  type: z.enum([TRANSACTION_TYPE.DEPOSIT, TRANSACTION_TYPE.WITHDRAWAL, TRANSACTION_TYPE.TRANSFER], {
    required_error: 'Please select a transaction type',
  }),
  amount: z
    .number({ invalid_type_error: 'Please enter a valid amount' })
    .positive({ message: 'Amount must be greater than zero' }),
  date: z.string({ required_error: 'Please select a date' }).min(1, 'Please select a date'),
  description: z.string().optional(),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
```

### Suggested implementation

```tsx
// components/features/TransactionForm/TransactionForm.tsx
'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Select } from '@/components/ui/Select'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import { DatePicker } from '@/components/ui/DatePicker'
import { Input } from '@/components/ui/Input'
import { useTransactions } from '@/context/TransactionsContext'
import { TRANSACTION_TYPE } from '@/shared/constants/transaction'
import { transactionSchema, type TransactionFormValues } from './schema'
import type { TransactionFormProps } from './types'

const TRANSACTION_TYPE_OPTIONS = [
  { label: 'Deposit', value: TRANSACTION_TYPE.DEPOSIT },
  { label: 'Withdrawal', value: TRANSACTION_TYPE.WITHDRAWAL },
  { label: 'Transfer', value: TRANSACTION_TYPE.TRANSFER },
]

export function TransactionForm({ onSuccess, onCancel, initialValues }: TransactionFormProps) {
  const { addTransaction } = useTransactions()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: initialValues?.type ?? undefined,
      amount: initialValues?.amount ?? 0,
      date: initialValues?.date ?? '',
      description: initialValues?.description ?? '',
    },
  })

  async function onSubmit(values: TransactionFormValues) {
    await addTransaction(values)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        <FormField label="Transaction type" htmlFor="type" error={errors.type?.message} required>
          <Select
            id="type"
            options={TRANSACTION_TYPE_OPTIONS}
            placeholder="Select a type"
            error={!!errors.type}
            aria-describedby={errors.type ? 'type-description' : undefined}
            {...register('type')}
          />
        </FormField>

        <FormField label="Amount" htmlFor="amount" error={errors.amount?.message} required>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                id="amount"
                value={field.value}
                onValueChange={field.onChange}
                error={!!errors.amount}
                aria-describedby={errors.amount ? 'amount-description' : undefined}
              />
            )}
          />
        </FormField>

        <FormField label="Date" htmlFor="date" error={errors.date?.message} required>
          <DatePicker
            id="date"
            error={!!errors.date}
            aria-describedby={errors.date ? 'date-description' : undefined}
            {...register('date')}
          />
        </FormField>

        <FormField label="Description" htmlFor="description" helperText="Optional">
          <Input
            id="description"
            placeholder="e.g. Grocery shopping"
            {...register('description')}
          />
        </FormField>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" fullWidth loading={isSubmitting}>
          Save transaction
        </Button>
      </div>
    </form>
  )
}
```

### Storybook stories

> Stories use a mock `TransactionsProvider` so they can be rendered in Storybook without a running json-server.

```tsx
// components/features/TransactionForm/TransactionForm.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TRANSACTION_TYPE } from '@/shared/constants/transaction'
import { TransactionForm } from './TransactionForm'

const meta: Meta<typeof TransactionForm> = {
  title: 'Features/TransactionForm',
  component: TransactionForm,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    onSuccess: () => console.log('success'),
    onCancel: () => console.log('cancel'),
  },
}
export default meta
type Story = StoryObj<typeof TransactionForm>

export const Empty: Story = {}

export const PrefilledDeposit: Story = {
  args: {
    initialValues: {
      type: TRANSACTION_TYPE.DEPOSIT,
      amount: 5000,
      date: '2025-03-05',
      description: 'March salary',
    },
  },
}

export const PrefilledWithdrawal: Story = {
  args: {
    initialValues: {
      type: TRANSACTION_TYPE.WITHDRAWAL,
      amount: 120.5,
      date: '2025-03-07',
    },
  },
}
```

---

## Step 2 — Build the Home Page (`app/page.tsx`)

### Page sections

| Section             | Component(s) used                       |
| ------------------- | --------------------------------------- |
| Balance hero        | `BalanceCard`                           |
| Transaction totals  | `TransactionSummary`                    |
| Quick-add shortcut  | `Button` + `Modal` + `TransactionForm`  |
| Recent transactions | `TransactionList` (limited to last 5)   |
| Loading state       | `SkeletonList`, `Skeleton`              |
| Empty state         | `EmptyState` (inside `TransactionList`) |

### Suggested implementation

```tsx
// app/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, ArrowRight } from 'lucide-react'
import { BalanceCard } from '@/components/features/BalanceCard'
import { TransactionSummary } from '@/components/features/TransactionSummary'
import { TransactionList } from '@/components/features/TransactionList'
import { TransactionForm } from '@/components/features/TransactionForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Skeleton, SkeletonList } from '@/components/ui/Skeleton'
import { useTransactions } from '@/context/TransactionsContext'

export default function HomePage() {
  const { balance, recentTransactions, transactions, isLoading } = useTransactions()
  const [addModalOpen, setAddModalOpen] = useState(false)

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      {/* ── Balance hero ───────────────────────────────────── */}
      {isLoading ? (
        <div className="rounded-lg bg-primary/10 p-6">
          <Skeleton className="mb-2 h-3 w-24" />
          <Skeleton className="h-9 w-48" />
        </div>
      ) : (
        <BalanceCard balance={balance} />
      )}

      {/* ── Summary + quick-add row ────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          ) : (
            <TransactionSummary transactions={transactions} />
          )}
        </div>

        <Button
          leftIcon={<Plus size={16} />}
          onClick={() => setAddModalOpen(true)}
          className="shrink-0 sm:self-start"
        >
          New transaction
        </Button>
      </div>

      {/* ── Recent transactions ────────────────────────────── */}
      <section aria-labelledby="recent-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="recent-heading" className="text-base font-semibold text-text-primary">
            Recent transactions
          </h2>
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <SkeletonList lines={5} />
        ) : (
          <TransactionList
            transactions={recentTransactions}
            emptyMessage="No transactions yet. Add your first one!"
          />
        )}
      </section>

      {/* ── Add transaction modal ──────────────────────────── */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="New transaction"
        size="md"
      >
        <TransactionForm
          onSuccess={() => setAddModalOpen(false)}
          onCancel={() => setAddModalOpen(false)}
        />
      </Modal>
    </main>
  )
}
```

---

## Step 3 — Responsive layout breakdown

The Home page follows a **mobile-first** approach. Every layout decision is made at the base (mobile) level first, with overrides added upward via `sm:` and `md:` prefixes.

| Section                  | Mobile (default)              | `sm` (640px+)                        |
| ------------------------ | ----------------------------- | ------------------------------------ |
| Page wrapper             | Single column, `px-4 py-8`    | Same, constrained by `max-w-5xl`     |
| Balance card             | Full width                    | Full width                           |
| Summary + quick-add row  | Stacked column (`flex-col`)   | Side-by-side row (`sm:flex-row`)     |
| `TransactionSummary`     | 1 column grid                 | 3 column grid (`sm:grid-cols-3`)     |
| "New transaction" button | Full row (natural block)      | `shrink-0 sm:self-start`             |
| Recent transactions      | Full width list, stacked rows | Full width, rows expand horizontally |
| Form action buttons      | Stacked (`flex-col`)          | Side-by-side (`sm:flex-row`)         |

### Key responsive patterns used in this page

```tsx
// Summary + button: stacked on mobile, side-by-side on sm+
<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

// Form actions: stacked on mobile, right-aligned on sm+
<div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
```

---

## Step 4 — Wiring the quick-add shortcut

The "New transaction" button and the `Modal` + `TransactionForm` are connected via a single `useState` boolean in the page:

```tsx
const [addModalOpen, setAddModalOpen] = useState(false)

// Open
<Button onClick={() => setAddModalOpen(true)}>New transaction</Button>

// Close on success or cancel
<TransactionForm
  onSuccess={() => setAddModalOpen(false)}
  onCancel={() => setAddModalOpen(false)}
/>
```

After `addTransaction` resolves in the form, `onSuccess` fires → `setAddModalOpen(false)` → modal closes. The `TransactionList` re-renders automatically because `recentTransactions` is derived from the updated context state.

---

## Step 5 — Loading states

The `isLoading` flag from `useTransactions()` is truthy on the initial mount while the fetch to json-server resolves. Use it to conditionally render skeletons instead of empty or stale UI:

| Element              | Loading state                | Loaded state             |
| -------------------- | ---------------------------- | ------------------------ |
| `BalanceCard`        | Two `Skeleton` lines         | `<BalanceCard />`        |
| `TransactionSummary` | Three `Skeleton` blocks      | `<TransactionSummary />` |
| `TransactionList`    | `<SkeletonList lines={5} />` | `<TransactionList />`    |

---

## Checklist

### `TransactionForm`

- [ ] Zod schema validates `type`, `amount`, `date`; `description` is optional
- [ ] React Hook Form wired with `zodResolver`
- [ ] `CurrencyInput` controlled via `Controller`
- [ ] Error messages displayed per field via `FormField`
- [ ] `isSubmitting` state disables/loads the submit button
- [ ] `onSuccess` called after `addTransaction` resolves
- [ ] `onCancel` wired to the Cancel button
- [ ] `initialValues` pre-populates the form (used in edit flow later)
- [ ] Action buttons stack on mobile, align right on `sm+`
- [ ] Stories documented in Storybook (Empty, PrefilledDeposit, PrefilledWithdrawal)

### Home page (`app/page.tsx`)

- [ ] `BalanceCard` displays `balance` from context
- [ ] `TransactionSummary` receives full `transactions` array
- [ ] `TransactionList` receives `recentTransactions` (last 5, derived in context)
- [ ] "View all" link navigates to `/transactions`
- [ ] "New transaction" button opens the modal
- [ ] `TransactionForm` inside `Modal` calls `addTransaction` on submit
- [ ] Modal closes on success and on cancel
- [ ] New transaction appears in `TransactionList` immediately after submit (optimistic update via context state)
- [ ] Loading skeletons shown while `isLoading` is `true`
- [ ] Empty state renders in `TransactionList` when there are no recent transactions

### Responsive

- [ ] Summary + button row stacks on mobile, side-by-side on `sm+`
- [ ] `TransactionSummary` is 1 column on mobile, 3 columns on `sm+`
- [ ] Form action buttons stack on mobile, align right on `sm+`
- [ ] Page tested at 375px, 768px, and 1280px breakpoints
- [ ] No horizontal overflow at any tested breakpoint

### General

- [ ] `'use client'` directive present on `app/page.tsx` (uses `useState`)
- [ ] `<main>` landmark with `max-w-5xl mx-auto` wrapper
- [ ] `<section aria-labelledby="recent-heading">` for the recent transactions section
- [ ] `react-hook-form` and `zod` installed and working

# Day 5-7: Data Layer & Types

## Goals

- Create shared constants folder (`shared/constants/transaction.ts`)
- Define TypeScript types: `Transaction`, `TransactionType`, `Account`
- Create `data/transactions.json` with 20+ mock entries
- Implement CRUD data access layer (`lib/transactions.ts`)
- Set up global state management with React Context API

---

## Step 1 — Create Shared Constants (`shared/constants/transaction.ts`)

Create the file `shared/constants/transaction.ts` with the `TRANSACTION_TYPE` constant. Using a `const` object instead of raw string literals prevents typos across the codebase and gives autocomplete everywhere the constant is imported.

```ts
// shared/constants/transaction.ts

export const TRANSACTION_TYPE = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRANSFER: 'transfer',
} as const
```

> **Why `as const`?** It narrows the value types from `string` to their exact literal values (`'deposit'`, `'withdrawal'`, `'transfer'`). This lets TypeScript derive the `TransactionType` union directly from the object in the next step, keeping the single source of truth in one place.

---

## Step 2 — Define TypeScript Types (`types/index.ts`)

Create the file `types/index.ts` with all shared types used across the app. `TransactionType` is derived from `TRANSACTION_TYPE` so there is no duplication.

```ts
// types/index.ts

import { TRANSACTION_TYPE } from '@/shared/constants/transaction'

export type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]

export interface Transaction {
  id: string
  type: TransactionType
  amount: number // always positive; direction is determined by `type`
  date: string // ISO 8601 format: "YYYY-MM-DD"
  description: string
}

export interface Account {
  id: string
  owner: string
  balance: number
  transactions: Transaction[]
}

// Utility types used by forms and CRUD operations
export type NewTransaction = Omit<Transaction, 'id'>
export type UpdateTransaction = Partial<NewTransaction>
```

> **Why `amount` is always positive?**
> The `type` field already encodes direction (`deposit` = credit, `withdrawal` = debit). Keeping `amount` positive avoids sign confusion in the UI and simplifies balance calculations.

> **Why `date` as `string`?**
> JSON doesn't have a native `Date` type. Storing as ISO string avoids serialization issues and makes mock data readable. Convert to `Date` only when formatting for display.

---

## Step 3 — Create Mock Data (`data/transactions.json`)

Create `data/transactions.json` with at least 20 varied entries covering all transaction types and a realistic date range.

```json
[
  {
    "id": "txn-001",
    "type": "deposit",
    "amount": 5000.0,
    "date": "2025-01-05",
    "description": "January salary"
  },
  {
    "id": "txn-002",
    "type": "withdrawal",
    "amount": 120.5,
    "date": "2025-01-07",
    "description": "Supermarket"
  },
  {
    "id": "txn-003",
    "type": "transfer",
    "amount": 800.0,
    "date": "2025-01-10",
    "description": "Rent payment"
  },
  {
    "id": "txn-004",
    "type": "withdrawal",
    "amount": 45.0,
    "date": "2025-01-12",
    "description": "Streaming services"
  },
  {
    "id": "txn-005",
    "type": "deposit",
    "amount": 350.0,
    "date": "2025-01-15",
    "description": "Freelance project"
  },
  {
    "id": "txn-006",
    "type": "withdrawal",
    "amount": 200.0,
    "date": "2025-01-18",
    "description": "Electricity bill"
  },
  {
    "id": "txn-007",
    "type": "transfer",
    "amount": 500.0,
    "date": "2025-01-20",
    "description": "Transfer to savings"
  },
  {
    "id": "txn-008",
    "type": "withdrawal",
    "amount": 89.9,
    "date": "2025-01-22",
    "description": "Pharmacy"
  },
  {
    "id": "txn-009",
    "type": "deposit",
    "amount": 150.0,
    "date": "2025-01-25",
    "description": "Refund received"
  },
  {
    "id": "txn-010",
    "type": "withdrawal",
    "amount": 310.0,
    "date": "2025-01-28",
    "description": "Internet + phone bill"
  },
  {
    "id": "txn-011",
    "type": "deposit",
    "amount": 5000.0,
    "date": "2025-02-05",
    "description": "February salary"
  },
  {
    "id": "txn-012",
    "type": "withdrawal",
    "amount": 75.0,
    "date": "2025-02-08",
    "description": "Restaurant"
  },
  {
    "id": "txn-013",
    "type": "transfer",
    "amount": 800.0,
    "date": "2025-02-10",
    "description": "Rent payment"
  },
  {
    "id": "txn-014",
    "type": "withdrawal",
    "amount": 430.0,
    "date": "2025-02-13",
    "description": "Clothing store"
  },
  {
    "id": "txn-015",
    "type": "deposit",
    "amount": 200.0,
    "date": "2025-02-16",
    "description": "Cash gift"
  },
  {
    "id": "txn-016",
    "type": "withdrawal",
    "amount": 60.0,
    "date": "2025-02-19",
    "description": "Fuel"
  },
  {
    "id": "txn-017",
    "type": "transfer",
    "amount": 1000.0,
    "date": "2025-02-21",
    "description": "Emergency fund"
  },
  {
    "id": "txn-018",
    "type": "withdrawal",
    "amount": 190.0,
    "date": "2025-02-24",
    "description": "Gym membership"
  },
  {
    "id": "txn-019",
    "type": "deposit",
    "amount": 420.0,
    "date": "2025-02-27",
    "description": "Sold old equipment"
  },
  {
    "id": "txn-020",
    "type": "withdrawal",
    "amount": 55.0,
    "date": "2025-02-28",
    "description": "Books"
  },
  {
    "id": "txn-021",
    "type": "deposit",
    "amount": 5000.0,
    "date": "2025-03-05",
    "description": "March salary"
  },
  {
    "id": "txn-022",
    "type": "withdrawal",
    "amount": 140.0,
    "date": "2025-03-08",
    "description": "Dental appointment"
  },
  {
    "id": "txn-023",
    "type": "transfer",
    "amount": 800.0,
    "date": "2025-03-10",
    "description": "Rent payment"
  }
]
```

---

## Step 3 — Implement the Data Access Layer (`lib/transactions.ts`)

Create `lib/transactions.ts` with pure CRUD functions that operate on an in-memory array. The Context will call these internally.

```ts
// lib/transactions.ts

import type { Transaction, NewTransaction, UpdateTransaction } from '@/types'
import { TRANSACTION_TYPE } from '@/shared/constants/transaction'

// Generates a simple unique ID for new transactions
function generateId(): string {
  return `txn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function getAll(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getById(transactions: Transaction[], id: string): Transaction | undefined {
  return transactions.find((t) => t.id === id)
}

export function create(transactions: Transaction[], data: NewTransaction): Transaction[] {
  const newTransaction: Transaction = { id: generateId(), ...data }
  return [...transactions, newTransaction]
}

export function update(
  transactions: Transaction[],
  id: string,
  data: UpdateTransaction
): Transaction[] {
  return transactions.map((t) => (t.id === id ? { ...t, ...data } : t))
}

export function remove(transactions: Transaction[], id: string): Transaction[] {
  return transactions.filter((t) => t.id !== id)
}

// ---- Balance helpers ----

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => {
    if (t.type === TRANSACTION_TYPE.DEPOSIT) return acc + t.amount
    if (t.type === TRANSACTION_TYPE.WITHDRAWAL) return acc - t.amount
    return acc // transfers are neutral (internal movement)
  }, 0)
}

export function getRecent(transactions: Transaction[], limit = 5): Transaction[] {
  return getAll(transactions).slice(0, limit)
}
```

> **Design decision — pure functions:** all helpers receive the current array and return a new array without mutating. This makes them easy to test and pairs cleanly with `useReducer` or `useState` in the Context.

---

## Step 4 — Set Up React Context (`context/TransactionsContext.tsx`)

Create `context/TransactionsContext.tsx` to provide global state and actions to the entire app.

```tsx
// context/TransactionsContext.tsx
'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Transaction, NewTransaction, UpdateTransaction } from '@/types'
import { create, update, remove, calculateBalance, getRecent, getAll } from '@/lib/transactions'
import mockData from '@/data/transactions.json'

interface TransactionsContextValue {
  transactions: Transaction[]
  balance: number
  recentTransactions: Transaction[]
  addTransaction: (data: NewTransaction) => void
  updateTransaction: (id: string, data: UpdateTransaction) => void
  deleteTransaction: (id: string) => void
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null)

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockData as Transaction[])

  const addTransaction = (data: NewTransaction) => {
    setTransactions((prev) => create(prev, data))
  }

  const updateTransaction = (id: string, data: UpdateTransaction) => {
    setTransactions((prev) => update(prev, id, data))
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => remove(prev, id))
  }

  return (
    <TransactionsContext.Provider
      value={{
        transactions: getAll(transactions),
        balance: calculateBalance(transactions),
        recentTransactions: getRecent(transactions),
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions(): TransactionsContextValue {
  const ctx = useContext(TransactionsContext)
  if (!ctx) throw new Error('useTransactions must be used inside <TransactionsProvider>')
  return ctx
}
```

---

## Step 5 — Register the Provider in the Root Layout (`app/layout.tsx`)

Wrap the app with `TransactionsProvider` so all pages and components can consume the context.

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { TransactionsProvider } from '@/context/TransactionsContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'FinTrack',
  description: 'Personal financial management app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TransactionsProvider>{children}</TransactionsProvider>
      </body>
    </html>
  )
}
```

---

## Step 6 — How to consume the context in components

```tsx
// Example: display balance and recent transactions
'use client'

import { useTransactions } from '@/context/TransactionsContext'

export function BalanceSummary() {
  const { balance, recentTransactions } = useTransactions()

  return (
    <div>
      <p className="text-3xl font-bold text-text-primary">
        {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </p>
      <ul>
        {recentTransactions.map((t) => (
          <li key={t.id}>
            {t.description} — {t.amount}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

```tsx
// Example: add a new transaction
'use client'

import { useTransactions } from '@/context/TransactionsContext'
import { TRANSACTION_TYPE } from '@/shared/constants/transaction'

export function QuickAdd() {
  const { addTransaction } = useTransactions()

  const handleSubmit = () => {
    addTransaction({
      type: TRANSACTION_TYPE.DEPOSIT,
      amount: 100,
      date: new Date().toISOString().split('T')[0],
      description: 'Quick deposit',
    })
  }

  return <button onClick={handleSubmit}>Add</button>
}
```

---

## Checklist

- [ ] Created `shared/constants/transaction.ts` with `TRANSACTION_TYPE`
- [ ] Created `types/index.ts` with `Transaction`, `TransactionType`, `Account`, `NewTransaction`, `UpdateTransaction`
- [ ] Created `data/transactions.json` with 20+ entries (mix of deposit, withdrawal, transfer)
- [ ] Created `lib/transactions.ts` with `getAll`, `getById`, `create`, `update`, `remove`, `calculateBalance`, `getRecent`
- [ ] Created `context/TransactionsContext.tsx` with `TransactionsProvider` and `useTransactions` hook
- [ ] Registered `TransactionsProvider` in `app/layout.tsx`
- [ ] Verified that `useTransactions()` returns correct balance and transactions from mock data
- [ ] Verified that add/update/delete operations update the state and re-render consumers

# Day 27-31: Transaction List Page

## Goals

- Implement a dedicated `/transacoes` page listing all transactions
- Allow filtering by transaction type (deposit, withdrawal, transfer)
- Allow filtering by date range
- Allow sorting by date or amount
- Reuse `TransactionList` / `TransactionItem` built in Days 22-26

---

## Prerequisites

Before starting, confirm all of the following are ready:

- [ ] `TransactionList` and `TransactionItem` implemented (Days 22-26, Task 4)
- [ ] `EmptyState` implemented (Days 18-21)
- [ ] `SkeletonList` implemented (Days 18-21)
- [ ] `useTransactions()` returns `{ transactions, isLoading }` (Days 5-7)
- [ ] `Sidebar` navigation link for `/transacoes` added

---

## Expected file structure at the end

```
app/
└── transacoes/
    └── page.tsx                                   # Transaction list page

components/
└── features/
    └── TransactionFilters/
        ├── TransactionFilters.tsx                 # Type + date range filter bar
        ├── ITransactionFilters.ts
        ├── TransactionFilters.stories.tsx
        └── index.ts
```

---

## Task 1 — Add `/transacoes` route and page shell

Create `app/transacoes/page.tsx` with the page heading and a placeholder for the filter bar and list.

```tsx
// app/transacoes/page.tsx
export default function TransacoesPage() {
  return (
    <div className="flex flex-col gap-lg">
      <h1 className="heading-default text-content-primary">Transações</h1>
      {/* Task 2: <TransactionFilters /> */}
      {/* Task 3: <TransactionList /> wired to filtered results */}
    </div>
  );
}
```

Also add the route to the Sidebar nav links so `/transacoes` is reachable.

**Done when:** navigating to `/transacoes` renders the heading and the Sidebar highlights the correct link.

---

## Task 2 — Build `TransactionFilters`

A controlled filter bar that exposes the current filter state to its parent via callbacks.

### Props

| Prop       | Type                              | Description                        |
| ---------- | --------------------------------- | ---------------------------------- |
| `value`    | `TransactionFilters`              | Current filter values (controlled) |
| `onChange` | `(f: TransactionFilters) => void` | Called on any filter change        |

### TypeScript interface

```ts
// components/features/TransactionFilters/ITransactionFilters.ts
import type { TransactionType } from '@/types';

export interface TransactionFiltersValue {
  type: TransactionType | 'all';
  dateFrom: string;
  dateTo: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

export interface TransactionFiltersProps {
  value: TransactionFiltersValue;
  onChange: (filters: TransactionFiltersValue) => void;
}
```

### Default values

```ts
export const DEFAULT_FILTERS: TransactionFiltersValue = {
  type: 'all',
  dateFrom: '',
  dateTo: '',
  sortBy: 'date',
  sortOrder: 'desc',
};
```

### UI controls

| Control     | Component    | Options                                  |
| ----------- | ------------ | ---------------------------------------- |
| Type filter | `Select`     | All, Depósito, Saque, Transferência      |
| Date from   | `DatePicker` | —                                        |
| Date to     | `DatePicker` | —                                        |
| Sort by     | `Select`     | Data, Valor                              |
| Sort order  | `Select`     | Mais recente, Mais antigo / Maior, Menor |

### Storybook stories

```tsx
export const Default: Story = {};
export const TypeFiltered: Story = { args: { value: { ...DEFAULT_FILTERS, type: 'deposit' } } };
export const DateRangeFiltered: Story = {
  args: { value: { ...DEFAULT_FILTERS, dateFrom: '2025-01-01', dateTo: '2025-03-31' } },
};
```

**Done when:** changing any filter control calls `onChange` with the updated value.

---

## Task 3 — Wire filters to `TransactionList`

Apply the active filters and sort order to the transactions array in the page before passing them down to `TransactionList`.

```ts
// app/transacoes/page.tsx
const filtered = transactions
  .filter((t) => filters.type === 'all' || t.type === filters.type)
  .filter((t) => !filters.dateFrom || t.date >= filters.dateFrom)
  .filter((t) => !filters.dateTo || t.date <= filters.dateTo)
  .sort((a, b) => {
    const dir = filters.sortOrder === 'asc' ? 1 : -1;
    if (filters.sortBy === 'amount') return (a.amount - b.amount) * dir;
    return (a.date < b.date ? -1 : 1) * dir;
  });
```

> `TransactionList` will need an optional `transactions` prop so the page can pass the filtered array instead of reading from context directly.

**Done when:** selecting a type filter shows only matching transactions; the list updates without a page reload.

---

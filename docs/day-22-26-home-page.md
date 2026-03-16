# Day 22-26: Home Page

## Goals

- Implement the Home page connecting real context data to the UI components built in Phase 2
- Display the current account balance using `BalanceCard`
- Show all transactions using `TransactionList` (the "Extrato" section from Figma)
- Provide a quick-add shortcut via the refactored `NewTransaction` component
- Deliver a fully responsive layout that works on mobile and desktop

---

## Prerequisites

Before starting, confirm all of the following are ready:

- [x] `BalanceCard` implemented and exported (Days 14-17)
- [x] `Header` component implemented and registered in `app/layout.tsx` (Days 18-21)
- [x] `Modal` and `FeedbackModal` implemented and exported (Days 18-21)
- [x] `Skeleton` / `SkeletonList` implemented (Days 18-21)
- [x] `EmptyState` implemented and exported (Days 18-21)
- [x] `TransactionsProvider` registered in `app/layout.tsx` (Days 5-7)
- [x] `useTransactions()` returns `{ transactions, balance, isLoading, addTransaction }` (Days 5-7)
- [x] `json-server` running on port 3001 (`npm run api`) alongside `npm run dev`

---

## Expected file structure at the end

```
app/
└── page.tsx                                  # Home page (this phase)

components/
├── features/
│   ├── TransactionList/
│   │   ├── TransactionList.tsx               # Extrato list (Task 4)
│   │   ├── TransactionItem.tsx               # Single row with badge, name, date, amount
│   │   ├── ITransactionList.ts
│   │   ├── TransactionList.stories.tsx
│   │   └── index.ts
│   ├── TransactionForm/
│   │   ├── TransactionForm.tsx               # Reusable form fields — add & edit (Task 3)
│   │   ├── ITransactionForm.ts
│   │   ├── schema.ts                         # Zod schema
│   │   ├── TransactionForm.stories.tsx
│   │   └── index.ts
│   └── NewTransaction/
│       ├── NewTransaction.tsx                # Refactored: trigger button + Modal + TransactionForm (Task 3)
│       ├── INewTransaction.ts
│       └── index.ts
```

> `NewTransaction` is refactored from the legacy prototype — form fields move to `TransactionForm` and `NewTransaction` becomes a thin orchestrator (button + `Modal` + feedback).
>
> Edit and delete actions in `TransactionList` are out of scope — icon buttons are visual placeholders only, wired in Days 37-40.

---

## Task 1 — Home page layout (`app/page.tsx`)

Set up the responsive shell of the page with placeholder sections. No real data yet — just the grid/flex structure with `Skeleton` placeholders so the layout can be reviewed before wiring.

### Responsive layout

| Breakpoint       | Layout                                                                  |
| ---------------- | ----------------------------------------------------------------------- |
| Mobile (default) | Single column: balance → new transaction → transaction list             |
| `lg` (1024px+)   | Two columns: left = balance + new transaction, right = transaction list |

```tsx
// app/page.tsx — skeleton layout (Task 1 output)
<div className="flex flex-col gap-lg lg:flex-row lg:items-start">
  <div className="flex flex-col gap-lg lg:flex-1">
    {/* Task 2: <BalanceCard /> */}
    {/* Task 3: <NewTransaction /> */}
  </div>
  <div className="lg:w-80 lg:shrink-0">{/* Task 4: <TransactionList /> */}</div>
</div>
```

**Done when:** the two-column layout renders correctly at all breakpoints (verify with Storybook viewport or browser devtools).

---

## Task 2 — `BalanceCard` integration

Drop `<BalanceCard />` into the left column and connect it to `useTransactions()`.

### Loading state

While `isLoading` is `true`, render the `BalanceCardSkeleton` in its place:

```tsx
{
  isLoading ? <BalanceCardSkeleton /> : <BalanceCard balance={balance} />;
}
```

**Done when:** the balance loads from `json-server` and the skeleton is visible during the ~1s fetch delay (add `setTimeout` mock if needed).

---

## Task 3 — `NewTransaction` refactor + `TransactionForm`

### `TransactionForm` — new component

A controlled form with `react-hook-form` + Zod. Pure form — no modal, no button. Accepts callbacks and optional initial values for reuse in the edit flow (Days 37-40).

#### Install dependencies

```bash
npm install react-hook-form zod @hookform/resolvers
```

#### Props

| Prop            | Type                      | Default     | Description                                  |
| --------------- | ------------------------- | ----------- | -------------------------------------------- |
| `onSuccess`     | `() => void`              | —           | Called after a successful submit             |
| `onCancel`      | `() => void`              | —           | Called when the user cancels                 |
| `initialValues` | `Partial<NewTransaction>` | `undefined` | Pre-populates the form for the edit use case |

#### TypeScript interface

```ts
// components/features/TransactionForm/ITransactionForm.ts
import type { NewTransaction } from '@/types';

export interface TransactionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialValues?: Partial<NewTransaction>;
}
```

#### Zod schema

```ts
// components/features/TransactionForm/schema.ts
export const transactionSchema = z.object({
  type: z.enum([TRANSACTION_TYPE.DEPOSIT, TRANSACTION_TYPE.WITHDRAWAL, TRANSACTION_TYPE.TRANSFER], {
    required_error: 'Selecione um tipo de transação',
  }),
  amount: z
    .number({ invalid_type_error: 'Informe um valor válido' })
    .positive({ message: 'O valor deve ser maior que zero' }),
  date: z.string().min(1, 'Selecione uma data'),
  description: z.string().optional(),
});
```

#### Storybook stories

```tsx
export const Empty: Story = {};
export const PrefilledDeposit: Story = {
  args: { initialValues: { type: 'deposit', amount: 5000, date: '2025-03-05' } },
};
export const PrefilledWithdrawal: Story = {
  args: { initialValues: { type: 'withdrawal', amount: 120.5, date: '2025-03-07' } },
};
```

---

### `NewTransaction` — refactored

Replaces the legacy prototype. Owns only the orchestration layer:

1. Renders the "Nova transação" trigger button
2. Controls the `Modal` open/close state via `useState`
3. Renders `<TransactionForm>` inside the `Modal`
4. Calls `useFeedback()` on success

```tsx
function handleSuccess() {
  setOpen(false);
  showFeedback({
    type: 'success',
    title: 'Transação adicionada!',
    message: 'Seu extrato foi atualizado.',
  });
}
```

**Done when:** user can open the modal, submit a transaction, see the success `FeedbackModal`, and the form resets on re-open.

---

## Task 4 — `TransactionList` + `TransactionItem`

### Purpose

The "Extrato" section. Reads from `useTransactions()` and renders a scrollable list of transaction cards. Handles its own loading and empty states.

### `TransactionItem` props

| Prop          | Type          | Description                    |
| ------------- | ------------- | ------------------------------ |
| `transaction` | `Transaction` | The transaction data to render |

> Edit and delete icon buttons are rendered as visual placeholders (no `onClick`). Actions wired in Days 37-40.

### `TransactionList` props

No props — reads directly from `useTransactions()`.

### TypeScript interfaces

```ts
// components/features/TransactionList/ITransactionList.ts
import type { Transaction } from '@/types';

export interface TransactionItemProps {
  transaction: Transaction;
}

export interface TransactionListProps {}
```

### Badge colours per type

| Type         | Token (bg)             | Token (text)               |
| ------------ | ---------------------- | -------------------------- |
| `deposit`    | `bg-badge-deposit-bg`  | `text-badge-deposit-text`  |
| `withdrawal` | `bg-badge-withdraw-bg` | `text-badge-withdraw-text` |
| `transfer`   | `bg-badge-transfer-bg` | `text-badge-transfer-text` |

### Loading / empty states

```tsx
if (isLoading) return <SkeletonList lines={5} />;
if (!transactions.length)
  return <EmptyState title="Nenhuma transação" description="Adicione sua primeira transação." />;
```

### Storybook stories

```tsx
export const WithTransactions: Story = {
  /* mock transactions via decorator */
};
export const EmptyList: Story = {
  /* no transactions → EmptyState */
};
export const LoadingState: Story = {
  /* isLoading: true → SkeletonList */
};
```

**Done when:** transactions from `json-server` render in the list; adding a new transaction via `NewTransaction` updates the list in real time.

---

# Day 32-40: Edit Transaction

## Goals

- Allow the user to edit an existing transaction directly from `TransactionItem`
- Reuse `NewTransaction` (with `TransactionForm` inline) pre-populated via `editingTransaction` prop
- Update the transaction in context and reflect changes immediately in both `TransactionList` and `BalanceCard`
- Show success/error feedback via `FeedbackModal`

---

## Prerequisites

Before starting, confirm all of the following are ready:

- [ ] `TransactionForm` extracted from `NewTransaction` and exported (Days 22-26, Task 3)
- [ ] `TransactionItem` renders edit icon button as visual placeholder (Days 22-26, Task 4)
- [ ] `TransactionList` implemented (Days 22-26, Task 4)
- [ ] `FeedbackModal` + `useFeedback()` implemented (Days 18-21)
- [ ] `useTransactions()` exposes `updateTransaction(id, data)` (Days 5-7)

---

## Expected file structure at the end

No new components — changes are limited to existing files:

```
components/
└── features/
    ├── NewTransaction/
    │   └── NewTransaction.tsx     # Accepts optional editingTransaction prop
    ├── TransactionItem/
    │   └── TransactionItem.tsx    # Edit button wired with onEdit callback
    └── TransactionList/
        └── TransactionList.tsx    # Holds editing state, passes onEdit to each item
```

> No `EditTransaction` component needed — the inline `NewTransaction` card handles both add and edit depending on whether `editingTransaction` is set.

---

## Task 1 — Expose `updateTransaction` in context

Extend `useTransactions()` to support updating an existing transaction by id.

```ts
// context/TransactionsContext.tsx
updateTransaction: (id: string, data: Partial<NewTransaction>) => Promise<void>;
```

Implementation calls the API (`PATCH /transactions/:id`) and replaces the item in local state.

**Done when:** calling `updateTransaction` reflects the change in `transactions` without a full page reload.

---

## Task 2 — Extend `NewTransaction` to support edit mode

Add an optional `editingTransaction` prop. When set, `TransactionForm` renders pre-filled and submit calls `updateTransaction` instead of `addTransaction`.

### Props update

```ts
// INewTransaction.ts — updated
import type { Transaction } from '@/types';

export interface NewTransactionProps {
  editingTransaction?: Transaction; // undefined = add mode, Transaction = edit mode
}
```

### Behavior

```tsx
const isEditing = !!editingTransaction;

// TransactionForm receives initialValues when editing
<TransactionForm initialValues={editingTransaction} onSubmit={handleFormSubmit} />;

// Confirmation step calls the right context method
async function handleConfirm() {
  try {
    if (isEditing) {
      await updateTransaction(editingTransaction!.id, pendingData!);
      showFeedback({
        type: 'success',
        title: 'Transação atualizada!',
        message: 'As alterações foram salvas.',
      });
    } else {
      await addTransaction(pendingData!);
      showFeedback({
        type: 'success',
        title: 'Transação adicionada!',
        message: 'Seu extrato foi atualizado.',
      });
    }
  } catch {
    showFeedback({ type: 'error', title: 'Erro ao salvar', message: 'Tente novamente.' });
  }
}
```

**Done when:** `NewTransaction` renders pre-filled when `editingTransaction` is passed and calls `updateTransaction` on confirm.

---

## Task 3 — Wire `onEdit` through `TransactionList` → `TransactionItem`

### Changes to `TransactionItem`

Wire the edit icon button with an `onEdit` callback:

```ts
// ITransactionList.ts — updated
export interface TransactionItemProps {
  transaction: Transaction;
  onEdit: () => void; // was a visual placeholder, now wired
}
```

### Changes to `TransactionList`

Hold the selected transaction in state and pass it to `NewTransaction` via `editingTransaction`:

```tsx
// In the page (app/page.tsx) — TransactionList bubbles up the selected item
const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

<NewTransaction editingTransaction={editingTransaction ?? undefined} />
<TransactionList onEdit={(t) => setEditingTransaction(t)} />
```

**Done when:** clicking the pencil icon on any row pre-fills the `NewTransaction` form with that transaction's data.

---

## Task 4 — Validation and cancel behavior

`TransactionForm` already handles validation via Zod — no changes needed. Confirm:

- Submitting with invalid data shows inline error messages
- Closing the confirmation modal returns to the filled form
- Clearing the edit selection (e.g. clicking elsewhere) resets the form to empty add mode

**Done when:** all cancel paths work correctly in both add and edit mode.

---

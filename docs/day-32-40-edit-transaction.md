# Day 32-40: Edit Transaction

## Goals

- Allow the user to edit an existing transaction directly from `TransactionItem`
- Open an edit modal when clicking the edit button and pre-fill `TransactionForm` with the selected transaction
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

This implementation uses a dedicated edit modal component and keeps async state in the page container:

```
app/
└── transactions/
    └── page.tsx                              # Holds pendingEdit + isUpdating and submits update

components/
└── features/
    ├── EditTransactionModal/
    │   ├── EditTransactionModal.tsx          # Wraps Modal + TransactionForm for edit mode
    │   └── IEditTransactionModal.tsx
    ├── TransactionItem/
    │   └── TransactionItem.tsx               # Edit button wired with onEdit callback
    ├── TransactionList/
    │   └── TransactionList.tsx               # Forwards onEdit/onDelete to each row
    └── TransactionForm/
        └── TransactionForm.tsx               # Uses isDirty/isSubmitting to control submit button
```

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

## Task 2 — Show edit modal when clicking edit button

When the user clicks the pencil icon, open `EditTransactionModal` with `TransactionForm` pre-filled with the selected transaction. Submitting this modal must call `updateTransaction` with the selected `id` and the edited form data.

### Behavior

```tsx
const [pendingEdit, setPendingEdit] = useState<Transaction | null>(null);
const [isUpdating, setIsUpdating] = useState(false);

function handleEditRequest(id: string) {
  const transaction = transactions.find((t) => t.id === id) ?? null;
  setPendingEdit(transaction);
}

<EditTransactionModal
  transaction={pendingEdit}
  onConfirm={handleEditConfirm}
  onCancel={handleEditCancel}
  isSubmitting={isUpdating}
/>;

async function handleEditConfirm(data: TransactionFormValues) {
  if (!pendingEdit) return;
  setIsUpdating(true);
  try {
    await updateTransaction(pendingEdit.id, data);
    showFeedback({
      type: 'success',
      title: 'Transação atualizada',
      message: 'A transação foi atualizada com sucesso.',
    });
    setPendingEdit(null);
  } catch {
    showFeedback({
      type: 'error',
      title: 'Erro ao atualizar',
      message: 'Não foi possível atualizar a transação. Tente novamente.',
    });
  } finally {
    setIsUpdating(false);
  }
}
```

**Done when:** clicking edit opens a pre-filled modal and confirming it calls `updateTransaction`.

---

## Task 3 — Wire `onEdit` through `TransactionList` → `TransactionItem`

### Changes to `TransactionItem`

Wire the edit icon button with an `onEdit` callback:

```ts
// ITransactionList.ts — updated
export interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
}
```

### Changes to `TransactionList`

Forward `onEdit` from list to row items:

```tsx
<TransactionItem transaction={transaction} onEdit={onEdit} />
```

**Done when:** clicking the pencil icon on any row calls `onEdit(id)` and opens the edit modal with that transaction's data.

---

## Task 4 — Validation and cancel behavior

`TransactionForm` handles validation via Zod and submit-state behavior. Confirm:

- Submitting with invalid data shows inline error messages
- In edit mode, submit remains disabled until at least one field changes (`isDirty`)
- While updating, inputs and action buttons are disabled (`isSubmitting`)
- Closing the edit modal clears selected transaction and does not affect add mode

**Done when:** all cancel paths work correctly in both add and edit mode.

---

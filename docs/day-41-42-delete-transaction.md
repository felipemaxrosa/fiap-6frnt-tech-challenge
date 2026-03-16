# Day 41-42: Delete Transaction

## Goals

- Allow the user to delete an existing transaction directly from `TransactionItem`
- Confirm the action via the existing `Modal` before calling the API
- Remove the transaction from context state and reflect the updated balance immediately
- Show success/error feedback via `FeedbackModal`

---

## Prerequisites

Before starting, confirm all of the following are ready:

- [ ] `TransactionItem` renders delete icon button as visual placeholder (Days 22-26, Task 4)
- [ ] `TransactionList` implemented (Days 22-26, Task 4)
- [ ] `Modal` implemented (Days 18-21)
- [ ] `FeedbackModal` + `useFeedback()` implemented (Days 18-21)
- [ ] `useTransactions()` exposes `deleteTransaction(id)` (Days 5-7)

---

## Expected file structure at the end

No new components — changes are limited to existing files:

```
components/
└── features/
    ├── TransactionItem/
    │   └── TransactionItem.tsx    # Delete button wired with onDelete callback
    └── TransactionList/
        └── TransactionList.tsx    # Holds deleting state, renders confirmation Modal
```

---

## Task 1 — Expose `deleteTransaction` in context

Extend `useTransactions()` to support removing a transaction by id.

```ts
// context/TransactionsContext.tsx
deleteTransaction: (id: string) => Promise<void>;
```

Implementation calls the API (`DELETE /transactions/:id`) and removes the item from local state. Balance recalculates automatically since it is derived from the transactions array.

**Done when:** calling `deleteTransaction` removes the item from `transactions` and `BalanceCard` updates without a page reload.

---

## Task 2 — Wire `onDelete` through `TransactionList` → `TransactionItem`

### Changes to `TransactionItem`

Wire the delete icon button with an `onDelete` callback:

```ts
// ITransactionList.ts — updated
export interface TransactionItemProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void; // was a visual placeholder, now wired
}
```

```tsx
<button onClick={onDelete} aria-label="Excluir transação">
  <Trash2 size={16} />
</button>
```

### Changes to `TransactionList`

Hold the transaction pending deletion in state and render the confirmation `Modal`:

```tsx
const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

// Pass down to each item
<TransactionItem
  key={t.id}
  transaction={t}
  onEdit={() => setEditing(t)}
  onDelete={() => setDeletingTransaction(t)}
/>

// Confirmation modal
<Modal
  isOpen={!!deletingTransaction}
  onClose={() => setDeletingTransaction(null)}
  title="Excluir transação"
>
  <p className="body-default text-content-secondary">
    Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
  </p>
  <div className="flex justify-end gap-sm mt-lg">
    <button onClick={() => setDeletingTransaction(null)}>Cancelar</button>
    <button onClick={handleConfirmDelete}>Excluir</button>
  </div>
</Modal>
```

**Done when:** clicking the trash icon on any row opens the confirmation modal with the correct transaction name.

---

## Task 3 — Confirm and execute deletion

```tsx
async function handleConfirmDelete() {
  try {
    await deleteTransaction(deletingTransaction!.id);
    setDeletingTransaction(null);
    showFeedback({
      type: 'success',
      title: 'Transação excluída!',
      message: 'O extrato foi atualizado.',
    });
  } catch {
    setDeletingTransaction(null);
    showFeedback({ type: 'error', title: 'Erro ao excluir', message: 'Tente novamente.' });
  }
}
```

**Done when:** confirming deletion removes the row from the list, updates the balance, and shows the success `FeedbackModal`; on API error shows the error `FeedbackModal`.

---

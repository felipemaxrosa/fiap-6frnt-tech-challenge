# Day 51-52: Performance

> **Depends on:** All Phase 4 work (Days 43-50) must be complete before starting this.
>
> - **Days 43-45** add `panelRef`, `previouslyFocused`, and keyboard state to `Modal` and `FeedbackModal` — profiling a component tree that is still structurally changing gives inaccurate baselines.
> - **Days 49-50** add `isError` state and `setIsError` to `TransactionsContext.tsx`. The memoization work in Task 1 of this doc must wrap the final version of the context value, not the pre-Day-49 one.
> - **React DevTools browser extension** must be installed (Chrome/Firefox) for the Profiler tab used on Day 52.

## Goal

Eliminate known re-render waste in the context layer and the filter hook, lazy-load the modal bundle, and confirm image delivery is already optimal via `next/image`.

---

## Audit Results

| #   | Issue                                                                                                                                                                                    | Severity | File                                             |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------ |
| 1   | Context value object is a new reference on every provider render — `getAll`, `calculateBalance`, `getRecent` run unsheltered                                                             | MEDIUM   | `TransactionsContext.tsx`                        |
| 2   | Mutation functions (`addTransaction`, `updateTransaction`, `deleteTransaction`) are recreated every render — stable references matter for consumers that `useCallback`-depend on them    | MEDIUM   | `TransactionsContext.tsx`                        |
| 3   | `filtered` array in `useTransactionFilters` is recomputed on every render of `TransactionsContent` — not memoized                                                                        | MEDIUM   | `useTransactionFilters.ts`                       |
| 4   | `EditTransactionModal`, `DeleteTransactionModal`, `ConfirmTransactionModal` are statically imported — included in the initial JS bundle even though they are never visible on first load | LOW      | `app/transactions/page.tsx`, `app/page.tsx`      |
| 5   | `getRecent` calls `getAll` internally — `getAll` runs twice per provider render (once for `transactions`, once inside `getRecent`)                                                       | LOW      | `TransactionsContext.tsx`, `lib/transactions.ts` |

**Already optimized:**

- `transactionsMap → transactions` array conversion wrapped in `useMemo` ✓
- `recentTransactions` on home page wrapped in `useMemo` ✓
- All images use `next/image` (WebP, lazy loading, sizing handled automatically) ✓
- `logo.svg` in Header has `priority` (above the fold) ✓
- Filters stored in URL params (`useSearchParams`) — no redundant state ✓

> **Honest scope check:** this is a mock app with ~20 transactions and no real network latency. None of these issues cause perceptible slowness. The value of fixing them is demonstrating React performance patterns for the challenge, not solving an actual bottleneck.

---

## Execution Order

| Day    | Tasks                                                                                         |
| ------ | --------------------------------------------------------------------------------------------- |
| **51** | Task 1 (memoize context value) · Task 2 (useCallback mutations) · Task 3 (memoize `filtered`) |
| **52** | Task 4 (lazy-load modals) · Task 5 (image audit) · Task 6 (React DevTools profile)            |

---

## Task 1 — Memoize derived values in `TransactionsContext`

**File:** `context/TransactionsContext.tsx`

**Problem:** The context `value` object is a plain literal computed inline. Even though `transactions` (the memoized array) only changes on CRUD or load, `getAll` and `calculateBalance` still run on every render, and the object reference is always new.

Also addresses issue #5: `getRecent` calls `getAll` internally. By computing a single `sorted` variable once and reusing it, `getAll` runs once per render instead of twice.

```tsx
// Before (lines 60-74)
return (
  <TransactionsContext.Provider
    value={{
      transactions: getAll(transactions),
      balance: calculateBalance(transactions),
      recentTransactions: getRecent(transactions),
      isLoading,
      isError,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    }}
  >
    {children}
  </TransactionsContext.Provider>
);

// After — extract derived values into a memoized object
const sorted = useMemo(() => getAll(transactions), [transactions]);

const contextValue = useMemo(
  () => ({
    transactions: sorted,
    balance: calculateBalance(transactions),
    recentTransactions: sorted.slice(0, 5),
    isLoading,
    isError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }),
  [sorted, transactions, isLoading, isError, addTransaction, updateTransaction, deleteTransaction]
);

return <TransactionsContext.Provider value={contextValue}>{children}</TransactionsContext.Provider>;
```

`sorted` replaces the `getAll` + `getRecent` double-call. `sorted.slice(0, 5)` replicates what `getRecent` does without a second sort. The `getRecent` import can be removed from this file.

---

## Task 2 — Wrap mutation functions in `useCallback`

**File:** `context/TransactionsContext.tsx`

**Problem:** `addTransaction`, `updateTransaction`, `deleteTransaction` are plain `async function` declarations inside the component — they get a new reference every render. This makes the `contextValue` memo from Task 1 invalidate whenever the provider re-renders for any reason (even an unrelated state change), because the dependency array includes these functions.

```tsx
// Before
const addTransaction = async (data: NewTransaction) => { ... };
const updateTransaction = async (id: string, data: UpdateTransaction) => { ... };
const deleteTransaction = async (id: string) => { ... };

// After
const addTransaction = useCallback(async (data: NewTransaction) => {
  const created = await TransactionService.create(data);
  setTransactionsMap((prev) => new Map(prev).set(created.id, created));
}, []);

const updateTransaction = useCallback(async (id: string, data: UpdateTransaction) => {
  const updated = await TransactionService.update(id, data);
  setTransactionsMap((prev) => new Map(prev).set(id, updated));
}, []);

const deleteTransaction = useCallback(async (id: string) => {
  await TransactionService.remove(id);
  setTransactionsMap((prev) => {
    const next = new Map(prev);
    next.delete(id);
    return next;
  });
}, []);
```

All three functions use the functional updater form of `setTransactionsMap` (`prev => ...`) — so they don't need `transactionsMap` in their closure, making the dependency array `[]` correct.

---

## Task 3 — Memoize `filtered` in `useTransactionFilters`

**File:** `hooks/useTransactionFilters.ts`

**Problem:** `filtered` is computed by chaining `.filter().filter().filter().sort()` directly in the hook body without `useMemo`. This reruns on every render of `TransactionsContent`, even when neither `transactions` nor `searchParams` has changed.

```tsx
// Before (lines 58-62)
const filtered = transactions
  .filter((t) => matchesType(t, filters.type))
  .filter((t) => matchesDateFrom(t, filters.dateFrom))
  .filter((t) => matchesDateTo(t, filters.dateTo))
  .sort((a, b) => sortTransactions(a, b, filters));

// After
const filtered = useMemo(
  () =>
    transactions
      .filter((t) => matchesType(t, filters.type))
      .filter((t) => matchesDateFrom(t, filters.dateFrom))
      .filter((t) => matchesDateTo(t, filters.dateTo))
      .sort((a, b) => sortTransactions(a, b, filters)),
  [transactions, filters]
);
```

Add `useMemo` to the imports at the top:

```tsx
import { useCallback, useMemo } from 'react';
```

> `filters` is derived from `searchParams` via `parseFiltersFromParams`. `searchParams` is a stable object from Next.js — it only changes when the URL changes. So the memo invalidates precisely when the user changes a filter or a transaction mutates.

---

## Task 4 — Lazy-load modal components

**Problem:** `EditTransactionModal`, `DeleteTransactionModal`, and `ConfirmTransactionModal` are statically imported. They (and their dependency `TransactionForm` with `react-hook-form` + `zod`) are included in the initial JS bundle sent to the browser, even though they're only needed when the user triggers a specific action.

Use `next/dynamic` to defer loading until the component is first rendered.

### `app/transactions/page.tsx`

```tsx
// Before
import { DeleteTransactionModal } from '@/components/features/DeleteTransactionModal';
import { EditTransactionModal } from '@/components/features/EditTransactionModal';

// After
import dynamic from 'next/dynamic';

const DeleteTransactionModal = dynamic(
  () =>
    import('@/components/features/DeleteTransactionModal').then((m) => m.DeleteTransactionModal),
  { ssr: false }
);
const EditTransactionModal = dynamic(
  () => import('@/components/features/EditTransactionModal').then((m) => m.EditTransactionModal),
  { ssr: false }
);
```

### `app/page.tsx`

```tsx
// Before
import { NewTransaction } from '@/components/features/NewTransaction';

// After — NewTransaction contains ConfirmTransactionModal + TransactionForm (react-hook-form + zod)
import dynamic from 'next/dynamic';

const NewTransaction = dynamic(
  () => import('@/components/features/NewTransaction').then((m) => m.NewTransaction),
  { ssr: false }
);
```

> `ssr: false` is correct for all of these — they are modal/interactive components that rely on `document` and client state. They are never server-rendered.

> There is no need for a `loading` fallback on these dynamic imports since the trigger component (the button that opens the modal) is visible before the modal is needed — the chunk loads in the background after the page is interactive.

---

## Task 5 — Image audit

**Files:** `components/features/BalanceCard/BalanceCard.tsx`, `components/ui/Header/Header.tsx`

Verify the following — no code changes expected, this is a confirmation pass:

| Image                      | Component     | `priority`? | Expected                        |
| -------------------------- | ------------- | ----------- | ------------------------------- |
| `logo.svg`                 | `Header`      | ✓ yes       | Correct — always above the fold |
| `pixels.png` (bottom-left) | `BalanceCard` | no          | Correct — decorative            |
| `pixels.png` (top-right)   | `BalanceCard` | no          | Correct — decorative            |
| `piggy-bank.png` (desktop) | `BalanceCard` | no          | Acceptable — not critical path  |
| `piggy-bank.png` (mobile)  | `BalanceCard` | no          | Acceptable — not critical path  |

`BalanceCard` renders two `<Image>` components with `aria-hidden="true"` and `alt=""` — these are purely decorative, no change needed.

Consider adding `priority` to `piggy-bank.png` on desktop if Lighthouse flags LCP. The piggy bank is visually prominent in `BalanceCard` which is above the fold on desktop.

Grep for any raw `<img>` tags to confirm none slipped through:

```bash
grep -r '<img ' tech-challenge/components tech-challenge/app --include="*.tsx"
```

Expected result: no matches. If any appear, replace with `next/image`.

---

## Task 6 — React DevTools Profiler run

**Prerequisite:** Install the [React DevTools browser extension](https://react.dev/learn/react-developer-tools) if not already installed.

### What to record

Open the Profiler tab → click Record → perform each action → Stop → inspect flame graph.

| Action                      | What to look for                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Change a filter (e.g. type) | Only `TransactionFilters` and `TransactionList` should re-render. `BalanceCard` and `NewTransaction` must NOT re-render. |
| Add a transaction (confirm) | `TransactionList` and `BalanceCard` should update. Modals should unmount cleanly.                                        |
| Edit a transaction          | Same as add — only data-dependent components should update.                                                              |
| Delete a transaction        | `TransactionList` and `BalanceCard` should update.                                                                       |

### Pass criteria

- No component outside the data-update path re-renders on filter change.
- `TransactionsProvider` re-renders only on CRUD operations and initial load — not on every user interaction.
- No component re-renders more than once per user action.

### Red flags

- `Header`, `Sidebar`, or `FeedbackProvider` re-rendering on filter change → context value leaking.
- `TransactionForm` inside `EditTransactionModal` rendering while the modal is closed → modal is mounted when it should be unmounted (conditional rendering regression).

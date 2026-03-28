# Day 57: Code Cleanup

> **Depends on:** All prior phases complete. Day 51-52 (Performance) should be done before this pass so the memoization changes are already in `TransactionsContext.tsx` — no cleanup conflicts.

## Goal

Remove every `console.log` from production code, resolve all ESLint warnings, fix three Storybook stories that still use raw `<input>` elements with hardcoded non-DS colors, and run a final formatter pass.

---

## Audit Results

| #   | Issue                                                                                                                                                                           | Severity | File                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------- |
| 1   | `console.log` in `onEdit`/`onDelete` callbacks passed to the home-page sidebar `TransactionList` — dead code since `showActions={false}`                                        | HIGH     | `app/page.tsx`          |
| 2   | Three `FormField` stories render raw `<input>` elements with hardcoded Tailwind colors instead of the `<Input>` DS component; each has a `TODO: Replace with <Input />` comment | MEDIUM   | `FormField.stories.tsx` |
| 3   | 33 ESLint `storybook/no-redundant-story-name` warnings across 8 story files — `name:` annotations duplicate what Storybook auto-derives from the export identifier              | LOW      | multiple                |

**Already clean:**

- `console.log` in `.stories.tsx` action handlers (e.g. `onEdit: (id) => console.log('edit', id)`) — idiomatic Storybook pattern; no change needed ✓
- No `debugger`, `eslint-disable`, or `@ts-ignore` comments anywhere in the codebase ✓
- No raw `<img>` tags — all images use `next/image` (verified in Day 51-52) ✓
- `FeedbackContext.tsx` and `TransactionsContext.tsx` have 0 ESLint errors under the project's `@typescript-eslint/no-unused-vars` config ✓

---

## Task 1 — Remove `console.log` from `app/page.tsx`

**File:** `app/page.tsx`

**Problem:** `TransactionList` on the home page sidebar has `showActions={false}` — the edit and delete icon buttons are never rendered, so `onEdit` and `onDelete` are never called. Leaving `console.log` is dead debug code in production.

```tsx
// Before (lines 30-31)
onEdit={(id) => console.log(id)}
onDelete={(id) => console.log(id)}

// After
onEdit={() => {}}
onDelete={() => {}}
```

> `onEdit` and `onDelete` are required props in `ITransactionList`. They must be provided even when `showActions={false}`. Empty arrow functions satisfy the type contract with no side effects.

---

## Task 2 — Fix `FormField.stories.tsx` TODO items

**File:** `components/ui/FormField/FormField.stories.tsx`

**Problem:** Three stories (`WithInput`, `WithError`, `FullTransactionForm`) render bare `<input>` elements with hardcoded colors (`border-gray-300`, `bg-white`, `text-gray-900`, `focus:ring-teal-600`) — bypassing the Design System. Each has a `TODO: Replace with <Input />` comment that was never resolved.

### Step 1 — Add `Input` import

```tsx
// Add alongside the existing imports at the top of the file
import { Input } from '../Input';
```

### Step 2 — `WithInput` story (lines 62-67)

```tsx
// Before
{/* TODO: Replace with <Input /> */}
<input
  id="description"
  placeholder="e.g.: Grocery shopping"
  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/50 focus:border-teal-600"
/>

// After
<Input id="description" placeholder="e.g.: Grocery shopping" />
```

### Step 3 — `WithError` story (lines 81-88)

```tsx
// Before
{/* TODO: Replace with <Input error /> */}
<input
  id="description-err"
  aria-describedby="description-err-description"
  placeholder="e.g.: Grocery shopping"
  className="w-full rounded-lg border border-red-400 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400/50"
/>

// After
<Input id="description-err" placeholder="e.g.: Grocery shopping" error />
```

> `FormField` handles `aria-describedby` wiring through its `error` prop — `Input` does not need the attribute passed manually here.

### Step 4 — `FullTransactionForm` story (lines 160-167)

```tsx
// Before
{/* TODO: Replace with <Input /> */}
<input
  id="desc-full"
  aria-describedby="desc-full-description"
  placeholder="e.g.: Grocery shopping"
  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/50 focus:border-teal-600"
/>

// After
<Input id="desc-full" placeholder="e.g.: Grocery shopping" />
```

After these three changes, `FormField.stories.tsx` uses only DS components — no raw HTML inputs, no hardcoded colors.

---

## Task 3 — Remove redundant `name:` annotations from story files

**Problem:** ESLint reports 33 `storybook/no-redundant-story-name` warnings. Storybook auto-converts PascalCase export names to title-case display names (`WithHelperText` → "With Helper Text", `NegativeBalance` → "Negative Balance"). When the `name:` field exactly matches that auto-derived label, it is redundant noise.

**Fix per file:** Delete the `name:` line from each story listed below. Leave `name:` on stories where it adds information not present in the export identifier (those are not flagged by ESLint).

### `components/features/BalanceCard/Balance.stories.tsx`

Remove `name:` from: `Default` (line 41), `NegativeBalance` (line 53), `WithoutOwner` (line 65), `CustomLabel` (line 77).

```ts
// Before
export const NegativeBalance: Story = {
  name: 'Negative Balance',
  args: { ... },
};

// After
export const NegativeBalance: Story = {
  args: { ... },
};
```

Apply the same single-line deletion to `Default`, `WithoutOwner`, and `CustomLabel`.

---

### `components/features/TransactionFilters/TransactionFilters.stories.tsx`

Remove `name:` from: `Default` (line 30).

> `TypeFiltered` → `'Type — Deposit'`, `DateRangeFiltered` → `'Date Range'`, and `SortByAmount` → `'Sort by Amount'` are NOT redundant — keep those `name:` fields.

---

### `components/features/TransactionItem/TransactionItem.stories.tsx`

Remove `name:` from: `Deposit` (line 30), `Withdrawal` (line 46), `Transfer` (line 62), `LongDescription` (line 78).

---

### `components/features/TransactionList/TransactionList.stories.tsx`

Remove `name:` from: `Default` (line 68), `Loading` (line 77), `Empty` (line 87).

> `EmptyWithCustomMessage` → `'Empty — Custom Message'`, `WithTitle` → `'With Title (Sidebar)'`, and `FullWidth` → `'Full Width (Transactions Page)'` are NOT redundant — keep those.

---

### `components/ui/CurrencyInput/CurrencyInput.stories.tsx`

Remove `name:` from: `Default` (line 68), `WithValue` (line 78), `WithHelperText` (line 88), `WithError` (line 102), `Disabled` (line 117).

---

### `components/ui/DatePicker/DatePicker.stories.tsx`

Remove `name:` from: `Default` (line 51), `WithValue` (line 61), `WithHelperText` (line 71), `WithError` (line 84), `Disabled` (line 94), `WithRange` (line 104).

---

### `components/ui/FormField/FormField.stories.tsx`

Remove `name:` from: `WithInput` (line 55), `WithError` (line 78), `Required` (line 100), `WithSelect` (line 114), `FullTransactionForm` (line 137).

---

### `components/ui/Select/Select.stories.tsx`

Remove `name:` from: `Default` (line 54), `WithHelperText` (line 64), `WithError` (line 78), `Disabled` (line 93), `NoLabel` (line 103).

---

## Task 4 — Final ESLint + Prettier pass

```bash
npm run lint
npm run format
```

**Expected result after Tasks 1-3:**

```
✖ 0 problems (0 errors, 0 warnings)
```

Commit only if the lint output is clean.

---

## Final checklist

- [ ] `npm run lint` → 0 errors, 0 warnings
- [ ] `npm run format` → no files changed (or format was run and committed)
- [ ] `grep -r "console.log" app/ context/ hooks/ lib/ components/` → no matches in production files (`.stories.tsx` files excluded)
- [ ] `grep -r "TODO" components/ui/FormField/FormField.stories.tsx` → no matches
- [ ] `npm run dev` → app loads at `http://localhost:3000`, no console errors in browser DevTools
- [ ] `npm run storybook` → FormField stories render `<Input>` with DS border colors (teal focus ring), not gray

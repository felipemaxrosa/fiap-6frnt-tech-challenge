# Day 46-48: Responsiveness

## Goal

Verify and fix layout, overflow, and touch-target issues at 375px, 768px, and 1280px. The structure is already mobile-first — these are targeted fixes for gaps found in the audit.

---

## Breakpoints in use

| Prefix   | Min-width | Where used                                  |
| -------- | --------- | ------------------------------------------- |
| _(none)_ | 0px       | Mobile default                              |
| `sm:`    | 640px     | Small tablet / landscape phone              |
| `lg:`    | 1024px    | Desktop — layout switches to sidebar + main |

> The app does **not** use `md:` for layout switches — only `sm:` and `lg:` are meaningful breakpoints.

---

## Audit Results

Tested against the actual component code at each breakpoint.

| #   | Issue                                                                                              | Severity | File                     |
| --- | -------------------------------------------------------------------------------------------------- | -------- | ------------------------ |
| 1   | Modal panel goes edge-to-edge on 375px (no horizontal margin)                                      | HIGH     | `Modal.tsx`              |
| 2   | Form action buttons are inline/right-aligned on mobile — not touch-friendly                        | HIGH     | `TransactionForm.tsx`    |
| 3   | `IconButton` touch target ~34px — below the 44px WCAG minimum                                      | HIGH     | `IconButton.tsx`         |
| 4   | Sidebar mobile nav links `py-sm` (~8px) — touch target ~36px                                       | MEDIUM   | `Sidebar.tsx`            |
| 5   | `TransactionFilters` "Limpar filtros" button wraps awkwardly at mid-widths                         | LOW      | `TransactionFilters.tsx` |
| 6   | `Header` uses hardcoded `max-w-[1200px]`; layout uses `max-w-300` (same value, different notation) | LOW      | `Header.tsx`             |

**Already good:**

- Home page: `flex-col` → `lg:flex-row` ✓
- `TransactionItem`: container queries (`@md:`) — adapts to container width, not viewport ✓
- `TransactionForm` row: `flex-col sm:flex-row` for amount + date ✓
- Navigation: hamburger on mobile, tab bar on tablet, sidebar on desktop ✓
- `BalanceCard`: `max-md:grid max-md:grid-cols-1` — centered layout on mobile ✓
- Font: fluid `clamp(0.875rem, …, 1rem)` — scales smoothly across widths ✓

---

## Execution Order

| Day    | Tasks                                                                           |
| ------ | ------------------------------------------------------------------------------- |
| **46** | Task 1 (Modal margin) · Task 2 (Form buttons) · Task 3 (IconButton target)      |
| **47** | Task 4 (Sidebar touch target) · Task 5 (Filters button) · Task 6 (Header max-w) |
| **48** | Full manual test at 375px / 768px / 1280px · fix any remaining overflow issues  |

---

## Task 1 — Modal horizontal margin on mobile

**File:** `components/ui/Modal/Modal.tsx`

**Problem:** The panel has `w-full max-w-[30rem]` but no horizontal margin. On 375px the panel is 375px wide — it touches both edges.

**Fix:** Add `px-4` to the outer centering wrapper. The `px-4` creates 16px breathing room on each side on all viewports; `max-w-[30rem]` on the panel still constrains it on larger screens.

```tsx
// Before
<div
  className="fixed inset-0 z-50 flex items-center justify-center"
  role="dialog"
  ...
>

// After
<div
  className="fixed inset-0 z-50 flex items-center justify-center px-4"
  role="dialog"
  ...
>
```

Result on 375px: panel = 375 − 32 = 343px wide, with 16px margin on each side.
Result on 640px+: panel = constrained by `max-w-[30rem]` (480px), centered.

> Note: `FeedbackModal` is a separate component — apply the same `px-4` change to its outer wrapper too.

---

## Task 2 — Form action buttons on mobile

**File:** `components/features/TransactionForm/TransactionForm.tsx`

**Problem:** The buttons wrapper is `flex justify-end gap-sm` — buttons are right-aligned and inline-sized on all viewports. On mobile, `Cancelar` and `Concluir transação` are small targets in the bottom-right corner.

**Fix:** Stack buttons full-width on mobile; restore `justify-end` row layout on `sm+`.

```tsx
// Before (line 152)
<div className="flex justify-end gap-sm mt-lg">

// After
<div className="flex flex-col gap-sm mt-lg sm:flex-row sm:justify-end">
```

With `flex-col`, both buttons get `w-full` naturally on mobile (because they're block-level inside a column flex). On `sm+` they shrink back to their natural inline size in a row.

> `Cancelar` is listed first in the DOM and renders on top in a column — which is fine (cancel before submit is the natural mobile pattern).

---

## Task 3 — `IconButton` touch target

**File:** `components/ui/Button/IconButton.tsx`

**Problem:** The button has `p-2` (8px padding) around an 18px icon → total size ≈ 34px × 34px. The minimum recommended touch target is 44px × 44px (WCAG 2.5.5).

**Fix:** Add `min-h-[44px] min-w-[44px]` to guarantee the minimum regardless of icon size.

```tsx
// Before
<button
  disabled={disabled}
  className={cn(
    'inline-flex items-center justify-center p-2 rounded-md text-content-primary cursor-pointer',
    'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
    'hover:bg-surface hover:rounded-full disabled:opacity-50 disabled:cursor-not-allowed',
    className
  )}
  {...props}
>

// After
<button
  disabled={disabled}
  className={cn(
    'inline-flex items-center justify-center p-2 rounded-md text-content-primary cursor-pointer',
    'min-h-[44px] min-w-[44px]',
    'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
    'hover:bg-surface hover:rounded-full disabled:opacity-50 disabled:cursor-not-allowed',
    className
  )}
  {...props}
>
```

The visual size doesn't change (the icon is still 18px with 8px padding), but the invisible hit area is now at least 44px × 44px.

---

## Task 4 — Sidebar mobile nav touch target

**File:** `components/ui/Sidebar/Sidebar.tsx`

**Problem:** Mobile nav links use `px-md py-sm`. With `py-sm` ≈ 8px and `text-base` line-height ≈ 24px, the total tap height is ~40px — just below the 44px target.

**Fix:** Change `py-sm` to `py-md` on the mobile `<ul>` links only.

```tsx
// Before — mobile list (line 30-43)
<Link
  href={link.href}
  onClick={onLinkClick}
  className={cn(
    'block rounded-default px-md py-sm',
    ...
  )}
>

// After
<Link
  href={link.href}
  onClick={onLinkClick}
  className={cn(
    'block rounded-default px-md py-md',
    ...
  )}
>
```

Only change the mobile `<ul>` (the one with `sm:hidden`). The tablet and desktop variants are fine since they're not touch-primary.

---

## Task 5 — `TransactionFilters` "Limpar filtros" button

**File:** `components/features/TransactionFilters/TransactionFilters.tsx`

**Problem:** The filter fields each have `min-w-40 flex-1` so they wrap predictably. The "Limpar filtros" button has neither, so when it wraps onto its own row it looks undersized compared to the full-width row above it.

**Fix:** Make it `w-full sm:w-auto` so it fills the row on mobile when it wraps, and shrinks to content width on larger screens.

```tsx
// Before
{
  onClear && (
    <Button variant="ghost" size="sm" onClick={onClear}>
      Limpar filtros
    </Button>
  );
}

// After
{
  onClear && (
    <Button variant="ghost" size="sm" onClick={onClear} className="w-full sm:w-auto">
      Limpar filtros
    </Button>
  );
}
```

---

## Task 6 — `Header` max-width token alignment

**File:** `components/ui/Header/Header.tsx`

**Problem:** The header inner container uses `max-w-[1200px]` (hardcoded pixels). The app layout uses `max-w-300` which resolves to the same `75rem = 1200px` in Tailwind v4's spacing scale. Both are equivalent, but using the token is consistent with the rest of the codebase.

**Fix:**

```tsx
// Before (line 16)
<div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-lg">

// After
<div className="mx-auto flex h-16 max-w-300 items-center justify-between px-lg">
```

> Before changing, confirm `max-w-300` renders at 1200px in the browser (DevTools → Computed → max-width on the element). If the values match, proceed.

---

## Day 48 — Manual Testing Checklist

Use Chrome DevTools device emulation. For each viewport, run the checks below.

### Setup

1. Open DevTools → Toggle device toolbar
2. Test at exactly: **375px**, **768px**, **1280px**
3. Also do a quick drag from 320px → 1440px to catch any broken intermediate widths

---

### 375px (iPhone SE / baseline mobile)

**Layout**

- [ ] Header shows logo + hamburger only; no nav links visible
- [ ] Hamburger opens full-screen nav drawer; links are tappable (verify touch target ≥ 44px tall)
- [ ] Home page: BalanceCard → NewTransaction form → TransactionList stack vertically, no horizontal overflow
- [ ] Transactions page: `<h1>` + filters + list stack vertically, no overflow
- [ ] TransactionFilters: filters wrap to 2–3 rows; "Limpar filtros" goes full-width when alone on a row

**Modals**

- [ ] Open any modal → panel has visible margin on left and right (not edge-to-edge)
- [ ] `FeedbackModal` same treatment

**Forms**

- [ ] `TransactionForm` buttons are stacked full-width; both buttons are easily tappable
- [ ] `CurrencyInput` is full-width; "R$" prefix doesn't overflow
- [ ] `Select` dropdown list is full-width; options are tappable

**Touch targets**

- [ ] `IconButton` (edit/delete in TransactionItem) — tap area feels large enough (≥ 44px)
- [ ] Sidebar nav links in mobile drawer — tap area is clearly tall

---

### 768px (tablet)

**Layout**

- [ ] Header shows logo + username; hamburger is hidden
- [ ] Horizontal tab nav bar appears below header (`sm:block lg:hidden`)
- [ ] Home page: still single-column (`lg:flex-row` only kicks in at 1024px)
- [ ] Transactions page: filters row has 2–3 items per row, wraps cleanly

**Forms**

- [ ] `TransactionForm` amount + date fields are side by side (`sm:flex-row`) ✓
- [ ] Form buttons are in a row, right-aligned (`sm:flex-row sm:justify-end`)

**Modals**

- [ ] Modal panel is centered with visible margin on all sides

---

### 1280px (desktop)

**Layout**

- [ ] Desktop vertical sidebar visible; horizontal tab nav hidden
- [ ] Home page: two-column layout (BalanceCard + NewTransaction on left; recent transactions on right)
- [ ] Right column is `w-80` (320px); left column fills remaining space
- [ ] Transactions page: filters in a single row; list scrollable within its container

**Overflow**

- [ ] No horizontal scrollbar on any page
- [ ] Long transaction descriptions truncate with ellipsis and do not break layout
- [ ] `TransactionItem` in `@md` container view: 4-column grid with badge / description / amount / actions

---

### Cross-breakpoint checks

- [ ] Resize slowly from 375px → 1280px; no layout "jumps" or content clipping
- [ ] `BalanceCard` content stays readable at all widths (piggy bank image, balance amount)
- [ ] `TransactionList` on the home page sidebar (right column) doesn't overflow its `w-80` container

---

## Known non-issues (do not change)

- `TransactionItem` uses container queries (`@md:`) not viewport breakpoints — this is intentional and correct.
- `h-fit` on the home page outer div — correct; `main` handles overflow scrolling.
- `BalanceCard` uses `max-md:` downward overrides — this is the one documented exception to the mobile-first rule; it's acceptable here because the breakpoint logic is limited to this component.

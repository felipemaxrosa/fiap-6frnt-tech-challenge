# feat: server-side pagination + README update

## Summary

- Implements server-side pagination on the transactions page using json-server's native `_page`/`_per_page` API
- Adds a `Pagination` Design System component with smart ellipsis logic
- Persists page and filter state in the URL via query params
- Updates README with pagination mention and refreshed screenshots
- Removes dead `console.log` from `app/page.tsx`

---

## What changed

### `services/TransactionService.ts`

Added `getPaginated()` alongside the existing `getAll()`. Builds the json-server query string (`_page`, `_per_page`, `_sort`, `type`, `date_gte`, `date_lte`) and returns the typed `PaginatedResponse` (`data`, `pages`, `items`).

```
GET /transactions?_page=1&_per_page=10&_sort=-date
→ { data: [...], pages: 3, items: 25 }
```

### `hooks/usePaginatedTransactions.ts` _(new)_

Standalone hook that owns the paginated fetch lifecycle:

- Derives `isLoading` from a `paramsKey` string (`page|type|dateFrom|dateTo|sortBy|sortOrder`) compared against `fetchedKey` in state — no synchronous `setState` inside effects, which satisfies the `react-hooks/set-state-in-effect` rule.
- Uses `.then()/.catch()` with a `cancelled` flag to safely discard in-flight responses on param changes.
- Exposes `refetch()` for post-CRUD refresh without changing params.

### `hooks/useTransactionFilters.ts`

Added `page` (read from URL `?page=`) and `setPage` (writes back to URL). Changing any filter resets `page` to 1 by omitting the param. All state lives in the URL, so sharing or refreshing the page preserves the exact view.

### `components/ui/Pagination/` _(new)_

DS-compliant pagination bar with:

- Prev / Next buttons (chevron icons, disabled at boundaries)
- Smart ellipsis: always shows first/last page + up to 5 pages around the current one
- Returns `null` when `totalPages <= 1` (no unnecessary chrome)
- Current page uses `bg-brand-primary text-white`; inactive pages use `bg-background hover:bg-surface`

### `app/transactions/page.tsx`

Wired `usePaginatedTransactions` + `useTransactionFilters` + `<Pagination>`. After every delete or edit, calls `refetch()` to sync the current page without resetting filters.

### `context/TransactionsContext.tsx`

Replaced a `useRef` guard (reset on every component remount) with a module-level `let initialFetchDone = false` flag. This prevents the context's `getAll()` from firing twice when Next.js App Router remounts `TransactionsProvider` during client-side navigation.

### `README.md` + `docs/screenshots/`

- Added "paginação server-side via json-server" to the features bullet
- Added `usePaginatedTransactions.ts` and `Pagination/` to the project structure
- Retook all 5 screenshots (home desktop, home mobile, transactions page — now showing pagination controls — confirm modal, success modal)

---

## Architecture decisions

**Why two separate fetches (context `getAll` + paginated)?**
The home page needs the full transaction list to compute balance and show recent items. The transactions page needs server-side filtering and pagination. Sharing one fetch would either load everything on the transactions page or break the balance calculation — two focused fetches is the cleaner boundary.

**Why URL for page state?**
Consistent with how filters already work. A shared URL preserves the full view state (page + filters) across navigation and refreshes, at zero extra cost.

**Why `paramsKey` for `isLoading` instead of a boolean in state?**
Setting `isLoading: true` synchronously before an `await` in an effect triggers the `react-hooks/set-state-in-effect` lint error. Deriving it from string comparison is both simpler and lint-clean.

---

## Test plan

- [ ] Navigate to `/transactions` — list loads page 1 (10 items), pagination bar shows correct total pages
- [ ] Click page 2 — URL updates to `?page=2`, correct items load
- [ ] Apply a type filter — page resets to 1 in URL, filtered results load
- [ ] Add a transaction from home — navigate to transactions, new item appears
- [ ] Delete a transaction on page 2 — list refreshes on the same page
- [ ] Edit a transaction — list refreshes, updated values appear
- [ ] Refresh with `?page=2&type=deposit` in URL — correct page and filter restored
- [ ] With only 1 page of results — pagination bar is hidden
- [ ] `npm run lint` → 0 errors, 0 warnings

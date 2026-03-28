# Tech Challenge - Fase 1: 60-Day Plan

## Project Overview

Build a **financial management frontend** using **Next.js** and a **Design System**.

**Deliverables:**

- Git repository with source code + README
- 5-minute demo video

**Core features:**

- Home page: account balance, transaction summary, new transaction shortcut
- Transaction list: view, edit, delete
- Add transaction: form (type, amount, date)
- Edit transaction: form modal/page
- Mocked backend (JSON file, json-server, or local state)

**Required tech:** Next.js, Design System (documented via Storybook/Docusaurus/GitBook), optional UI lib (MUI/Bootstrap/Tailwind)

---

## 60-Day Timeline

### Phase 1 - Setup & Planning (Days 1-7)

**Day 1-2: Project Bootstrap**

- [x] Create Next.js project with TypeScript (`npx create-next-app@latest`)
- [x] Choose and install UI library (Tailwind CSS)
- [x] Initialize Git repository
- [x] Set up ESLint, Prettier, Husky pre-commit hooks
- [x] Define folder structure (app/, components/, lib/, types/, data/)

**Day 3-4: Design System Foundation**

- [x] Install and configure Storybook
- [x] Define design tokens: colors, typography, spacing, shadows
- [x] Create base theme file
- [x] Study Figma reference: [Projeto Financeiro - Original](https://www.figma.com/design/ns5TC3X5Xr8V7I3LYKg9KA/Projeto-Financeiro?node-id=503-4264&t=gZy56WDAUfXtS23Y-1)
- [x] Study Figma reference: [Projeto Financeiro - Custom](https://www.figma.com/design/DBtYhdd97gkBoQ8Eu58aDA/Original?t=TbPEsp73W8FRbHC6-1)

**Day 5-7: Data Layer & Types**

- [x] Define TypeScript types: `Transaction`, `TransactionType`, `Account`
- [x] Create `transactions.json` mock data file (20+ entries)
- [x] Implement data access layer (CRUD functions in `lib/transactions.ts`)
- [x] Set up local state management (Context API or Zustand)

---

### Phase 2 - Core Components (Days 8-21)

**Day 8-10: Atomic Components (Design System)**

- [x] `Button` (primary, secondary, danger, sizes)
- [x] `Input` (text, number, date with validation states)
- [x] `Badge` (for transaction types)
- [x] `Card`
- [x] Document each in Storybook with all variants

**Day 11-13: Form Components**

- [x] `Select` / `Dropdown` for transaction type
- [x] `CurrencyInput` with masking
- [x] `DatePicker`
- [x] `FormField` wrapper (label + input + error)
- [x] Document in Storybook

**Day 14-17: Data Display Components**

- [x] `TransactionItem` (single row/card)
- [x] `TransactionList`
- [x] `BalanceCard` (current balance display)
- [x] `NewTransaction` (new transaction card)
- [ ] Document in Storybook

**Day 18-21: Layout & Navigation Components**

- [x] `Header` / `Navbar`
- [x] `Sidebar` (optional)
- [x] `Modal` / `Dialog` component
- [x] `EmptyState`
- [x] `Skeleton`
- [x] Document in Storybook

---

### Phase 3 - Pages & Features (Days 22-42)

**Day 22-26: Home Page** — see `docs/day-22-26-home-page.md`

- [x] Task 1: Home page layout shell (two-column responsive grid)
- [x] Task 2: `BalanceCard` integration with `useTransactions()` + loading skeleton
- [x] Task 3: `TransactionForm` component + `NewTransaction` refactor (add only, with `FeedbackModal`)
- [x] Task 4: `TransactionList` + `TransactionItem` (read-only, edit/delete are visual placeholders)

**Day 27-31: Transaction List Page** ⏳ Aguardando confirmacao do coordenador do curso — see `docs/day-27-31-transaction-list-page.md`

- [x] Task 1: `/transactions` page shell + Sidebar nav link
- [x] Task 2: `TransactionFilters` component (type, date range, sort)
- [x] Task 3: Wire filters to `TransactionList`

**Day 32-40: Edit Transaction** — see `docs/day-32-40-edit-transaction.md`

- [x] Task 1: Expose `updateTransaction` in `useTransactions()` context
- [x] Task 2: Build `EditTransaction` orchestrator (Modal + TransactionForm with initialValues)
- [x] Task 3: Wire `onEdit` through `TransactionList` → `TransactionItem`
- [x] Task 4: Validate cancel behavior (discard changes on all close paths)

**Day 41-42: Delete Transaction** — see `docs/day-41-42-delete-transaction.md`

- [x] Task 1: Expose `deleteTransaction` in `useTransactions()` context
- [x] Task 2: Wire `onDelete` through `TransactionList` → `TransactionItem` + confirmation `Modal`
- [x] Task 3: Confirm and execute deletion with success/error `FeedbackModal`

---

### Phase 4 - Polish & Accessibility (Days 43-52)

**Day 43-45: Accessibility (a11y)** — see `docs/day-43-45-accessibility.md`

- [ ] Task 1: Focus trap + restore in Modal (all modal variants inherit the fix)
- [ ] Task 2: Keyboard navigation in Select (Arrow/Enter/Escape/Home/End) + aria-controls
- [ ] Task 3: aria-invalid + aria-describedby on Input and CurrencyInput
- [ ] Task 4: Page structure — section + heading hierarchy in page.tsx and BalanceCard
- [ ] Task 5: Tooltip keyboard fallback (aria-label on truncated TransactionItem text)
- [ ] Task 6: FeedbackModal close button contextual label + color contrast check

**Day 46-48: Responsiveness** — see `docs/day-46-48-responsiveness.md`

- [ ] Task 1: Modal horizontal margin on mobile (add `px-4` to outer wrapper — `Modal` + `FeedbackModal`)
- [ ] Task 2: Form action buttons — stacked full-width on mobile (`flex-col sm:flex-row sm:justify-end`)
- [ ] Task 3: `IconButton` touch target — add `min-h-[44px] min-w-[44px]`
- [ ] Task 4: Sidebar mobile nav touch target — `py-sm` → `py-md` on mobile links
- [ ] Task 5: `TransactionFilters` clear button — `w-full sm:w-auto`
- [ ] Task 6: Header `max-w-[1200px]` → `max-w-300` (token alignment)
- [ ] Task 7: Manual test at 375px / 768px / 1280px + overflow check

**Day 49-50: Visual Consistency & UX** — see `docs/day-49-50-visual-consistency-ux.md`

- [x] Consistent use of design tokens
- [ ] Task 1: Wire `EmptyState` component in `TransactionList` (remove hardcoded colors)
- [ ] Task 2: Add `isError` to `TransactionsContext` + error UI in both pages
- [ ] Task 3: Modal action buttons stacked on mobile (`ConfirmTransactionModal`, `DeleteTransactionModal`)
- [ ] Task 4: Modal enter animation — backdrop fade + panel scale-fade (`globals.css` keyframes)
- [ ] Task 5: Mobile nav drawer slide-in animation

**Day 51-52: Performance** — see `docs/day-51-52-performance.md`

- [ ] Task 1: Memoize context derived values (`sorted`, `contextValue`) in `TransactionsContext`
- [ ] Task 2: Wrap mutation functions in `useCallback` in `TransactionsContext`
- [ ] Task 3: Memoize `filtered` in `useTransactionFilters`
- [ ] Task 4: Lazy-load modals with `next/dynamic` (`EditTransactionModal`, `DeleteTransactionModal`, `NewTransaction`)
- [ ] Task 5: Image audit — verify `priority` placement, grep for raw `<img>` tags
- [ ] Task 6: React DevTools Profiler run — verify no unexpected re-renders

---

### Phase 5 - Documentation (Days 53-57)

**Day 53-54: Storybook finalization** — see `docs/day-53-54-storybook.md`

- [ ] Task 1: Fix broken `WithSuccess` story in `Input.stories.tsx` (Input has no `success` prop)
- [ ] Task 2: Add `IconButton` stories to `Button.stories.tsx`
- [ ] Task 3: Add component-level `docs.description` to `Button`, `Input`, `Modal`, `Badge`, `TransactionForm`, `FeedbackModal`
- [ ] Task 4: Add `WithoutDot` to `Badge.stories.tsx` · `WithoutActions` to `TransactionItem.stories.tsx`
- [ ] Task 5: Upgrade `a11y` test mode `'todo'` → `'error'` in `preview.ts`
- [ ] Task 6: Smoke test every story in Storybook (`npm run storybook`)
- [ ] Task 7: a11y panel audit — confirm no red violations
- [ ] Task 8: Publish (Chromatic or GitHub Pages) · add URL to README

**Day 55-56: README** — see `docs/day-55-56-readme.md`

- [ ] Day 55: Replace boilerplate README with complete project-specific documentation (purpose, prerequisites, installation, env vars, structure, tech stack, Design System section with Storybook URL)
- [ ] Day 56: Take screenshots (home desktop, home mobile, transactions page, new transaction modal, success FeedbackModal) · save to `docs/screenshots/` · drop into README · final review checklist

**Day 57: Code cleanup**

- [ ] Remove unused code, console.logs, TODOs
- [ ] Final ESLint pass
- [ ] Ensure consistent code style

---

### Phase 6 - Delivery (Days 58-60)

**Day 58: Demo Video Recording**

- [ ] Record 5-minute video covering:
  - Home page overview
  - Balance and recent transactions
  - Navigate to transaction list
  - Add a new transaction (show form + success)
  - Edit an existing transaction
  - Delete a transaction (show confirmation)
  - Brief Storybook walkthrough

**Day 59: Final Review**

- [ ] Test full user flow end-to-end
- [ ] Check all checkboxes from the challenge requirements
- [ ] Verify README has all required info
- [ ] Push final commit to main branch

**Day 60: Submission**

- [ ] Submit Git repository link
- [ ] Submit demo video link

---

## Tech Stack Decisions

| Concern            | Choice                   | Reason                                   |
| ------------------ | ------------------------ | ---------------------------------------- |
| Framework          | Next.js 14+ (App Router) | Required                                 |
| Language           | TypeScript               | Type safety, better DX                   |
| Styling            | Tailwind CSS             | Utility-first, fast iteration            |
| UI Components      | shadcn/ui                | Accessible, customizable, Tailwind-based |
| Design System Docs | Storybook                | Industry standard, required by challenge |
| State Management   | React Context API        | Simple enough for this scope             |
| Mock Data          | JSON file + Context      | No extra dependencies needed             |
| Form Handling      | React Hook Form + Zod    | Lightweight, schema validation           |
| Icons              | Lucide React             | Consistent, tree-shakeable               |

---

## Folder Structure

```
/
├── app/
│   ├── page.tsx              # Home
│   ├── transactions/
│   │   └── page.tsx          # Transaction list
│   └── layout.tsx
├── components/
│   ├── ui/                   # Atomic Design System components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── ...
│   └── features/             # Feature-specific composed components
│       ├── TransactionItem/
│       ├── TransactionForm/
│       ├── BalanceCard/
│       └── ...
├── context/
│   └── TransactionsContext.tsx
├── lib/
│   └── transactions.ts       # CRUD helpers
├── data/
│   └── transactions.json     # Mock data
├── types/
│   └── index.ts
└── stories/                  # Storybook stories
```

---

## Challenge Requirements Checklist

- [ ] Next.js project configured and organized
- [ ] Home page with balance + recent transactions + new transaction shortcut
- [ ] Transaction list page with view/edit/delete
- [ ] Add transaction form (type, amount, date)
- [ ] Edit transaction form/modal
- [ ] Design System created with documented components (Storybook)
- [ ] Consistent visual design and good usability
- [ ] Accessibility considered
- [ ] Mock data implemented
- [ ] Git repository with public access
- [ ] README with setup instructions
- [ ] Demo video (max 5 minutes)

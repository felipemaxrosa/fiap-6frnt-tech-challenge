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
- [ ] Define design tokens: colors, typography, spacing, shadows
- [ ] Create base theme file
- [ ] Study Figma reference: [Projeto Financeiro](https://www.figma.com/design/ns5TC3X5Xr8V7I3LYKg9KA/Projeto-Financeiro?node-id=503-4264&t=gZy56WDAUfXtS23Y-1)

**Day 5-7: Data Layer & Types**

- [ ] Define TypeScript types: `Transaction`, `TransactionType`, `Account`
- [ ] Create `transactions.json` mock data file (20+ entries)
- [ ] Implement data access layer (CRUD functions in `lib/transactions.ts`)
- [ ] Set up local state management (Context API or Zustand)

---

### Phase 2 - Core Components (Days 8-21)

**Day 8-10: Atomic Components (Design System)**

- [ ] `Button` (primary, secondary, danger, sizes)
- [ ] `Input` (text, number, date with validation states)
- [ ] `Badge` (for transaction types)
- [ ] `Card`
- [ ] Document each in Storybook with all variants

**Day 11-13: Form Components**

- [ ] `Select` / `Dropdown` for transaction type
- [ ] `CurrencyInput` with masking
- [ ] `DatePicker`
- [ ] `FormField` wrapper (label + input + error)
- [ ] Document in Storybook

**Day 14-17: Data Display Components**

- [ ] `TransactionItem` (single row/card)
- [ ] `TransactionList`
- [ ] `BalanceCard` (current balance display)
- [ ] `TransactionSummary` (totals by type)
- [ ] Document in Storybook

**Day 18-21: Layout & Navigation Components**

- [ ] `Header` / `Navbar`
- [ ] `Sidebar` (optional)
- [ ] `Modal` / `Dialog` component
- [ ] `EmptyState`
- [ ] `LoadingSpinner` / `Skeleton`
- [ ] Document in Storybook

---

### Phase 3 - Pages & Features (Days 22-42)

**Day 22-26: Home Page**

- [ ] Implement balance display with mock data
- [ ] Recent transactions widget (last 5)
- [ ] Quick add transaction button/shortcut
- [ ] Responsive layout (mobile + desktop)

**Day 27-31: Transaction List Page**

- [ ] Full transaction list with pagination or infinite scroll
- [ ] Filter by type (deposit, transfer, withdrawal)
- [ ] Filter by date range
- [ ] Sort by date/amount
- [ ] Per-row action buttons: view details, edit, delete

**Day 32-36: Add Transaction**

- [ ] Create modal or dedicated page
- [ ] Form with: type, amount, date, description (optional)
- [ ] Form validation with error messages
- [ ] Success feedback (toast notification)
- [ ] Optimistic update to state

**Day 37-40: Edit Transaction**

- [ ] Pre-populate form with existing data
- [ ] Same validation as add form
- [ ] Update state and reflect changes immediately
- [ ] Cancel without saving

**Day 41-42: Delete Transaction**

- [ ] Confirmation dialog before deletion
- [ ] Remove from state and update balance
- [ ] Undo option (optional, bonus)

---

### Phase 4 - Polish & Accessibility (Days 43-52)

**Day 43-45: Accessibility (a11y)**

- [ ] Semantic HTML throughout
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation (Tab, Enter, Escape for modals)
- [ ] Focus management after modal open/close
- [ ] Color contrast check (WCAG AA)

**Day 46-48: Responsiveness**

- [ ] Mobile-first layout review
- [ ] Test on 375px, 768px, 1280px breakpoints
- [ ] Fix overflow and layout issues
- [ ] Touch-friendly tap targets

**Day 49-50: Visual Consistency & UX**

- [ ] Consistent use of design tokens
- [ ] Loading states for all async-like actions
- [ ] Error states
- [ ] Empty states (no transactions yet)
- [ ] Micro-interactions / transitions

**Day 51-52: Performance**

- [ ] Review unnecessary re-renders
- [ ] Lazy load heavy components if any
- [ ] Optimize images/icons

---

### Phase 5 - Documentation (Days 53-57)

**Day 53-54: Storybook finalization**

- [ ] Ensure all components have Stories with all variants
- [ ] Add component documentation (description, props table)
- [ ] Publish Storybook (Chromatic or GitHub Pages)

**Day 55-56: README**

- [ ] Project description and purpose
- [ ] Prerequisites (Node version, package manager)
- [ ] Step-by-step installation and run instructions
- [ ] Environment variables (if any)
- [ ] Project structure explanation
- [ ] Tech stack and why each was chosen
- [ ] Screenshots

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

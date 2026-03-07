# Project Structure

## Overview

This project is a financial management frontend built with Next.js (App Router), TypeScript, and Tailwind CSS.

---

## Directory Tree

```
/
├── app/
│   ├── layout.tsx              # Root layout (html, body, global styles)
│   ├── page.tsx                # Home page — balance, recent transactions, quick-add shortcut
│   ├── globals.css             # Global CSS and Tailwind directives
│   └── transactions/
│       └── page.tsx            # Transaction list page — view, filter, sort, edit, delete
│
├── components/
│   ├── ui/                     # Atomic, reusable Design System components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── Modal/
│   │   ├── Select/
│   │   ├── FormField/
│   │   ├── EmptyState/
│   │   └── LoadingSpinner/
│   └── features/               # Feature-specific composed components
│       ├── BalanceCard/
│       ├── TransactionItem/
│       ├── TransactionList/
│       ├── TransactionForm/
│       ├── TransactionSummary/
│       └── Header/
│
├── context/
│   └── TransactionsContext.tsx # Global state — transaction list, CRUD actions, balance
│
├── lib/
│   └── transactions.ts         # Pure CRUD helper functions (read, add, update, delete)
│
├── data/
│   └── transactions.json       # Mock data — 20+ transaction entries
│
├── types/
│   └── index.ts                # Shared TypeScript types: Transaction, TransactionType, Account
│
├── stories/                    # Storybook stories for all ui/ components
│   ├── Button.stories.tsx
│   ├── Input.stories.tsx
│   └── ...
│
├── public/                     # Static assets (SVGs, images)
│
├── docs/                       # Project documentation
│   ├── phase-1-plan.md         # 60-day delivery plan
│   └── project-structure.md    # This file
│
├── .husky/
│   └── pre-commit              # Runs lint-staged before every commit
│
├── next.config.ts
├── tailwind.config.ts          # Tailwind theme and design tokens (added in Day 3-4)
├── postcss.config.mjs
├── tsconfig.json
├── eslint.config.mjs           # ESLint + Next.js + Prettier rules
├── .prettierrc                 # Prettier formatting config
└── package.json
```

---

## Key Conventions

### Component structure

Each component in `components/ui/` and `components/features/` follows this pattern:

```
ComponentName/
├── index.tsx          # Component implementation and default export
├── ComponentName.stories.tsx   # Storybook stories
└── ComponentName.test.tsx      # Unit tests (if applicable)
```

### Naming

| Thing            | Convention         | Example                           |
| ---------------- | ------------------ | --------------------------------- |
| Component files  | PascalCase         | `Button/index.tsx`                |
| Helper/lib files | camelCase          | `transactions.ts`                 |
| Types            | PascalCase         | `Transaction`, `TransactionType`  |
| CSS classes      | Tailwind utilities | `className="text-sm font-medium"` |

### State management

All transaction state lives in `context/TransactionsContext.tsx`. Components consume it via the `useTransactions()` hook. No prop drilling.

### Mock data

`data/transactions.json` serves as the backend. On first load, `TransactionsContext` initializes from this file. All CRUD operations happen in memory.

---

## Tech Stack

| Concern            | Choice                      |
| ------------------ | --------------------------- |
| Framework          | Next.js 16 (App Router)     |
| Language           | TypeScript                  |
| Styling            | Tailwind CSS v4             |
| Design System Docs | Storybook                   |
| State              | React Context API           |
| Mock data          | JSON file + Context         |
| Form handling      | React Hook Form + Zod       |
| Icons              | Lucide React                |
| Linting            | ESLint + eslint-config-next |
| Formatting         | Prettier                    |
| Pre-commit         | Husky + lint-staged         |

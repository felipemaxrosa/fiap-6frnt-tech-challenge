# Day 59: Final Review

> **Depends on:** Day 58 complete — video recorded, uploaded, and link in hand. Day 57 (cleanup) done — 0 ESLint errors/warnings, no console.logs in production files.

## Goal

Verify every challenge requirement is met, test the full user flow end-to-end in a clean environment, confirm the README and repo are ready for submission, and push the final commit.

---

## Step 1 — Clean-environment smoke test

Start from zero: close all browser tabs, stop all running processes, reset the data file to its clean state.

### 1a — Reset mock data

The demo recording may have added/edited/deleted transactions. Restore `data/transactions.json` to its original 23-entry state (txn-001 through txn-023) before running the final test. The clean version ends with txn-023:

```json
{
  "id": "txn-023",
  "type": "transfer",
  "amount": 800,
  "date": "2026-03-10",
  "description": "Rent payment"
}
```

Confirm there is no test entry (`c9a0` / "asdasd") remaining.

### 1b — Start from a fresh terminal

```bash
cd tech-challenge
npm install           # confirm no missing packages
npm run dev           # starts Next.js (3000) + json-server (3001)
```

Open `http://localhost:3000` in Chrome at 100% zoom, 1280px width. Check the browser console — no errors, no warnings.

---

## Step 2 — Full user flow test

Walk through every feature in sequence. Check each box only when confirmed working.

### Home page

- [ ] Balance card renders with the correct balance amount
- [ ] Eye icon toggles balance visibility (shows `••••••`, reveals on second click)
- [ ] "Joana" (owner name) appears on the balance card
- [ ] Recent transactions sidebar shows the 5 most recent entries (sorted by date desc)
- [ ] Each item in the recent list has a badge (type indicator) and formatted amount
- [ ] "Todas as transações" button navigates to `/transactions`
- [ ] Skeleton loader appears briefly during initial data fetch (visible on hard refresh)

### Add transaction

- [ ] `NewTransaction` form is visible on the home page
- [ ] Type dropdown opens; all three options (Depósito, Saque, Transferência) are selectable
- [ ] Amount field formats input as Brazilian currency (type `1500` → shows `R$ 1.500,00`)
- [ ] DatePicker opens and accepts a date
- [ ] Description field accepts text input
- [ ] Clicking **Adicionar transação** with empty fields shows validation errors — form does not submit
- [ ] Filling all required fields and clicking **Adicionar transação** opens `ConfirmTransactionModal`
- [ ] Clicking **Confirmar** closes modal, shows green `FeedbackModal` ("Fechar" button)
- [ ] After closing FeedbackModal, the new transaction appears in the recent list

### Transaction list page (`/transactions`)

- [ ] All transactions appear in the list
- [ ] Each item shows type badge, description, amount, and date
- [ ] Edit (pencil) and delete (trash) icons visible on each row

### Filters

- [ ] Type filter: selecting "Depósito" shows only deposit transactions; selecting "Todos" restores the full list
- [ ] Date from filter: setting a start date hides transactions before that date
- [ ] Date to filter: setting an end date hides transactions after that date
- [ ] Sort: switching between options reorders the list correctly
- [ ] URL updates when filters are applied (e.g. `?type=deposit&sort=date-desc`)
- [ ] Navigating away and back restores the filtered state from the URL
- [ ] Clearing all filters restores the full list

### Edit transaction

- [ ] Clicking the pencil icon opens `EditTransactionModal` with the form pre-filled
- [ ] All fields are populated with the transaction's current values
- [ ] Changing a value and clicking **Salvar** closes the modal and shows success `FeedbackModal`
- [ ] The updated value is immediately reflected in the list without a page reload
- [ ] Clicking **Cancelar** discards changes and closes the modal

### Delete transaction

- [ ] Clicking the trash icon opens `DeleteTransactionModal` with a confirmation prompt
- [ ] Clicking **Excluir** deletes the transaction, shows success `FeedbackModal`
- [ ] The deleted entry is gone from the list
- [ ] Clicking **Cancelar** closes the modal without deleting

### Navigation

- [ ] Sidebar nav link "Início" navigates to `/`
- [ ] Sidebar nav link "Transações" navigates to `/transactions`
- [ ] On mobile (resize to 375px): hamburger menu icon appears; clicking it opens the mobile nav drawer
- [ ] Nav links in the mobile drawer navigate correctly and close the drawer

---

## Step 3 — Challenge requirements checklist

Go through each item from the challenge spec and confirm it is demonstrably complete.

| Requirement                                                         | Evidence                                                              | Status |
| ------------------------------------------------------------------- | --------------------------------------------------------------------- | ------ |
| Next.js project configured and organized                            | App router, TypeScript, folder structure in README                    |        |
| Home page: balance + recent transactions + add transaction shortcut | Visible at `/`                                                        |        |
| Transaction list page: view / edit / delete                         | Visible at `/transactions`                                            |        |
| Add transaction form (type, amount, date)                           | `NewTransaction` component on home page                               |        |
| Edit transaction form/modal                                         | `EditTransactionModal` opens from list                                |        |
| Design System with documented components (Storybook)                | `npm run storybook` → all components present; published URL in README |        |
| Consistent visual design and usability                              | DS tokens used throughout; no hardcoded colors after Day 57           |        |
| Accessibility considered                                            | `aria-*`, focus trap, keyboard nav (Days 43-45)                       |        |
| Mock data implemented                                               | `data/transactions.json` + json-server                                |        |
| Git repository with public access                                   | Confirm repo is public on GitHub                                      |        |
| README with setup instructions                                      | Clone → install → `.env.local` → `npm run dev` documented             |        |
| Demo video (max 5 minutes)                                          | Link recorded in Day 58; under 5:30                                   |        |

---

## Step 4 — README final read-through

Open the published README on GitHub (not the local file) and read it as a first-time visitor.

- [ ] Project name "Bytebank — Gerenciamento Financeiro" appears as the `<h1>`
- [ ] Demo video link is present and works
- [ ] Clone URL is correct (matches the actual repo)
- [ ] `npm run dev` step exactly matches the script in `package.json` — no discrepancies
- [ ] `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3001` is documented
- [ ] Storybook URL is filled in and opens the published Storybook
- [ ] All screenshots render (not broken image links)
- [ ] No mention of "create-next-app", "Vercel deploy", or "Edit `app/page.tsx`"
- [ ] GitHub repo About field (top-right on the repo page) has a short description set

---

## Step 5 — Build check

Confirm the project builds without errors (catches any TypeScript or import issues that `npm run dev` tolerates):

```bash
npm run build
```

Expected output: no errors. Warnings about `ssr: false` dynamic imports are expected and acceptable.

If the build fails, fix the error before pushing. Do not submit a repo with a broken build.

---

## Step 6 — Final ESLint pass

```bash
npm run lint
```

Expected: `0 problems (0 errors, 0 warnings)` after Day 57 cleanup.

---

## Step 7 — Push final commit

Stage only the files changed since the last commit. Typical candidates after Day 58-59 work:

- `data/transactions.json` (restored to clean state after demo recording)
- `README.md` (video link + screenshots added on Days 55-56)

```bash
git add data/transactions.json README.md
git status   # confirm nothing unexpected is staged
git commit -m "chore: restore clean mock data and finalize README for submission"
git push origin main
```

Confirm the push succeeded and the latest commit appears on GitHub.

---

## Step 8 — Repository settings check

On GitHub, verify:

- [ ] Repository is **Public** (Settings → Danger Zone → Change repository visibility)
- [ ] **About** field (gear icon top-right of the repo) has: description set, website URL (if Storybook is on GitHub Pages), and relevant topics (e.g. `nextjs`, `typescript`, `storybook`, `design-system`)
- [ ] Default branch is `main` and it has the latest commit

---

## Done

When all checkboxes above are ticked, Day 59 is complete. Day 60 is submission.

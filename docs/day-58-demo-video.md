# Day 58: Demo Video Recording

> **Depends on:** All prior phases complete and passing. Day 57 (code cleanup) must be done so the app shows no console errors during recording.

## Goal

Record a 5-minute screen capture demonstrating every required feature: home page, add transaction, full transaction list with filters, edit, delete, and a Storybook walkthrough.

---

## Pre-recording checklist

Do all of this before pressing Record.

### 1. Clean `data/transactions.json`

The last entry (`id: "c9a0"`, description `"asdasd"`) is test data from development. Remove it before recording so the list looks professional.

```json
// Remove this entry from the "transactions" array
{
  "id": "c9a0",
  "type": "deposit",
  "amount": 200,
  "date": "2026-03-18",
  "description": "asdasd"
}
```

The file should end with `txn-023` (Rent payment, 2026-03-10) as the last entry.

### 2. Start both servers

```bash
npm run dev
```

Confirm:

- App at `http://localhost:3000` — home page loads with the balance card and recent transactions
- json-server at `http://localhost:3001/transactions` — returns the transaction list

### 3. Browser setup

| Setting       | Value                                           |
| ------------- | ----------------------------------------------- |
| Browser       | Chrome (DevTools hidden, no extensions visible) |
| Zoom          | 100% (`Cmd+0`)                                  |
| Window size   | 1280 × 800 (or full-screen at 1280px+)          |
| URL bar       | Hidden or minimized if possible                 |
| Notifications | Disabled — turn on Do Not Disturb               |
| Bookmarks bar | Hidden (`Cmd+Shift+B`)                          |

Open `http://localhost:3000` and let the page load fully before starting.

### 4. Storybook ready in a second tab

```bash
npm run storybook
```

Open `http://localhost:6006` in a second Chrome tab. Pre-navigate to the `UI/Button` story so it's ready to switch to.

### 5. Prepare the demo transactions (memorize these)

You will perform three CRUD operations live. Use these exact values so the demo looks intentional:

| Action     | Field       | Value                              |
| ---------- | ----------- | ---------------------------------- |
| **Add**    | Type        | Depósito                           |
|            | Amount      | R$ 1.500,00                        |
|            | Date        | today's date                       |
|            | Description | Bônus trimestral                   |
| **Edit**   | Target      | "Supermarket" (txn-002, R$ 120,50) |
|            | Change      | Amount → R$ 135,00                 |
| **Delete** | Target      | "Books" (txn-020, R$ 55,00)        |

---

## Recording tool

**macOS (recommended):** QuickTime Player → File → New Screen Recording → select window or region → record.

**Alternative:** [Loom](https://www.loom.com) — records and uploads automatically, gives you a shareable link immediately. Free tier supports 5-minute videos.

**Resolution:** Record at 1280×800 minimum. Do not record at less than 720p — text becomes unreadable.

---

## Script — 5:00 target

Time each segment against a clock or timer while recording. The segment times are targets, not hard limits.

---

### Segment 1 — Introduction (0:00–0:20)

**Show:** Home page fully loaded.

**Say (or type in a text overlay):**

> "Bytebank — gerenciamento financeiro pessoal. Desenvolvido com Next.js 16, TypeScript, Tailwind CSS v4 e Design System próprio documentado no Storybook."

Keep this short. The app is visible — no need to narrate the tech stack in detail.

---

### Segment 2 — Home page: BalanceCard (0:20–0:50)

**Show:**

1. Point at the balance amount — let the evaluator see the current balance.
2. Click the eye icon to toggle balance visibility (hides the amount).
3. Click again to reveal it.
4. Point at the two decorative images (piggy bank, pixel art) — visual polish.

**Goal:** Show the balance toggle UX and the BalanceCard design.

---

### Segment 3 — Add a new transaction (0:50–2:00)

**Show:**

1. Scroll down slightly on the home page to show the `NewTransaction` form.
2. Fill in the form:
   - Type: select **Depósito** from the dropdown
   - Amount: type `1500` (mask formats it as `R$ 1.500,00`)
   - Date: pick today's date in the DatePicker
   - Description: type `Bônus trimestral`
3. Click **Adicionar transação**.
4. The **ConfirmTransactionModal** opens — pause here so the evaluator can see the summary.
5. Click **Confirmar**.
6. The **FeedbackModal** (green, success) appears — pause again.
7. Click **Fechar**.
8. Point at the "Transações recentes" sidebar — the new transaction appears at the top.

**Goal:** Demonstrates form validation, confirmation modal, success feedback, and live list update.

---

### Segment 4 — Transaction list page + filters (2:00–3:10)

**Show:**

1. Click **Todas as transações** button (or the sidebar nav link).
2. The `/transactions` page loads — full list visible.
3. Apply a **type filter**: select "Depósito" → list shrinks to deposits only.
4. Clear the filter.
5. Apply a **date filter**: set "De" to `2026-02-01` and "Até" to `2026-02-28` → only February transactions show.
6. Clear the filter.
7. Change **sort**: switch to "Maior valor" → list reorders by amount descending.
8. Point at the URL bar — show that filter params are reflected in the URL (`?sort=amount-desc`).

**Goal:** Demonstrates filter/sort UX, URL persistence, and the full transaction list layout.

---

### Segment 5 — Edit a transaction (3:10–4:00)

**Show:**

1. Clear all filters so the full list is visible.
2. Find "Supermarket" (txn-002, R$ 120,50) — scroll if needed.
3. Click the **pencil (edit) icon** on that row.
4. The `EditTransactionModal` opens with the form pre-filled.
5. Change the amount to `135` (clears and retypes in CurrencyInput).
6. Click **Salvar**.
7. The success FeedbackModal appears → click **Fechar**.
8. The row now shows R$ 135,00 — change is reflected immediately without a page reload.

**Goal:** Demonstrates edit flow, pre-filled form, and live update.

---

### Segment 6 — Delete a transaction (4:00–4:40)

**Show:**

1. Find "Books" (txn-020, R$ 55,00).
2. Click the **trash (delete) icon**.
3. The `DeleteTransactionModal` opens — confirmation prompt visible.
4. Click **Excluir**.
5. The success FeedbackModal appears → click **Fechar**.
6. "Books" is gone from the list.

**Goal:** Demonstrates delete confirmation pattern and list update.

---

### Segment 7 — Storybook walkthrough (4:40–5:00)

**Show:**

1. Switch to the Storybook tab (`http://localhost:6006`).
2. Click through 3–4 components quickly in the sidebar:
   - `UI / Button` — show variants (Primary, Secondary, Ghost, loading state)
   - `UI / Input` — show WithError state
   - `Features / BalanceCard` — show NegativeBalance variant
3. Point at the Docs tab on any component to show the auto-generated prop table.

**Goal:** 20 seconds is enough. Evaluators know Storybook — they just need to see it works and is populated.

---

## Post-recording

### Trim

Cut any dead time at the start and end. Keep the video under 5:30 to respect the 5-minute guideline.

### Export settings

| Setting    | Value            |
| ---------- | ---------------- |
| Format     | MP4 (H.264)      |
| Resolution | 1280×720 minimum |
| File size  | Under 500 MB     |

### Upload options

| Platform           | Notes                                       |
| ------------------ | ------------------------------------------- |
| YouTube (unlisted) | Best for sharing — paste link in submission |
| Loom               | Free, no account needed from evaluator      |
| Google Drive       | Share link with "Anyone with link can view" |

### Add to README

Once uploaded, add the video link to the README under a "Demo" section before the Funcionalidades block:

```markdown
## Demo

📹 **[Assistir ao vídeo de demonstração →](URL_DO_VIDEO)**
```

---

## What the evaluator is checking

| Requirement                                  | Where it appears in the video |
| -------------------------------------------- | ----------------------------- |
| Home page with balance + recent transactions | Segments 2–3                  |
| Add transaction with form                    | Segment 3                     |
| Transaction list page                        | Segment 4                     |
| Filters (type, date range, sort)             | Segment 4                     |
| Edit transaction                             | Segment 5                     |
| Delete transaction with confirmation         | Segment 6                     |
| Design System documented in Storybook        | Segment 7                     |
| Visual design and usability                  | Throughout                    |

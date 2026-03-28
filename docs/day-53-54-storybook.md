# Day 53-54: Storybook Finalization

> **Depends on:** Days 43-50 (all Phase 4 work) must be complete before finalizing stories.
>
> - **Day 43** changes `Input` and `CurrencyInput` API (`aria-invalid`, `aria-describedby`) — `WithError` stories must reflect the final props.
> - **Day 44** changes `Select` behaviour (keyboard nav, `aria-controls`) — story descriptions should mention keyboard interaction.
> - **Day 49** changes `TransactionList` empty state (now renders `EmptyState` component) — the `Empty` story will render differently.
> - **Day 49** changes `FeedbackModal` button text (contextual per type) — `Success`, `Error`, `Info` stories should note the new labels.
>
> Running `npm run storybook` and seeing accurate stories requires a stable, Phase-4-complete component tree.

## Goal

Fix incorrect or missing stories, add component-level documentation to all files that lack it, add missing variant stories, turn `a11y` violations into errors, then publish.

---

## Audit Summary

| #   | Issue                                                                                                                                       | Severity | File                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------- |
| 1   | `Input.stories.tsx` has a `WithSuccess` story passing a `success` prop — `Input` has no such prop; story silently renders the default state | HIGH     | `Input.stories.tsx`           |
| 2   | `IconButton` has no stories — it is a separate exported component in the Button folder, invisible in Storybook                              | HIGH     | `Button.stories.tsx`          |
| 3   | `Button`, `Modal`, `Badge`, `TransactionForm`, `FeedbackModal` have no component-level `docs.description`                                   | MEDIUM   | multiple                      |
| 4   | `Badge` is missing a `WithoutDot` variant story                                                                                             | MEDIUM   | `Badge.stories.tsx`           |
| 5   | `TransactionItem` is missing a `WithoutActions` story (the `showActions=false` state used on the home page)                                 | MEDIUM   | `TransactionItem.stories.tsx` |
| 6   | `a11y` test mode is `'todo'` — violations appear in the UI but don't fail tests                                                             | MEDIUM   | `.storybook/preview.ts`       |
| 7   | No publish step configured — Storybook is only runnable locally                                                                             | LOW      | `package.json`                |

**Already good:**

- All 26 components have a `.stories.tsx` file ✓
- `tags: ['autodocs']` on all meta objects → auto-generates prop tables ✓
- Custom viewports (`mobile`, `tablet`, `desktop`) in `preview.ts` ✓
- `Select`, `TransactionItem`, `TransactionList`, `BalanceCard` have full `argTypes` + per-story descriptions ✓
- `FeedbackModal` covers all three types + `WithoutCloseButton` ✓
- `Modal` covers `WithTitle`, `WithoutTitle`, `WithoutCloseButton` ✓
- `@chromatic-com/storybook` and `build-storybook` script already in place ✓

---

## Execution Order

| Day    | Tasks                                                                                                                                              |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **53** | Task 1 (fix broken Input story) · Task 2 (IconButton stories) · Task 3 (add missing descriptions) · Task 4 (missing variants) · Task 5 (a11y mode) |
| **54** | Task 6 (smoke test all stories) · Task 7 (a11y panel audit) · Task 8 (publish)                                                                     |

---

## Task 1 — Fix broken `WithSuccess` story in `Input.stories.tsx`

**File:** `components/ui/Input/Input.stories.tsx`

**Problem:** `Input` accepts `error?: boolean` but not `success`. The `WithSuccess` story passes `success: true` and `helperText: 'Valid email'` — the component ignores `success`, renders the default border, and the story is misleading.

**Fix:** Replace `WithSuccess` with a `WithHelperText` story that shows the neutral helper text state, which `Input` does support.

Also add a component-level description and `argTypes` while the file is open (covered in Task 3 below, but apply both changes together in one edit pass).

```tsx
// Remove this story entirely
export const WithSuccess: Story = {
  args: { label: 'Email', success: true, helperText: 'Valid email', value: 'user@email.com' },
};

// Replace with
export const WithHelperText: Story = {
  args: {
    label: 'Email',
    helperText: 'We will never share your email.',
    placeholder: 'you@example.com',
  },
};
```

---

## Task 2 — Add `IconButton` stories to `Button.stories.tsx`

**File:** `components/ui/Button/Button.stories.tsx`

**Problem:** `IconButton` is a separate exported component from `Button.tsx`. It has its own file (`IconButton.tsx`) and its own required prop (`aria-label`), but it is not covered by any story.

Add to the existing `Button.stories.tsx`:

```tsx
import { IconButton } from './IconButton';
import { Trash2, Pencil } from 'lucide-react';

// Add a dedicated section for IconButton using a render story
// (StoryObj<typeof IconButton> would require a second meta — use a render story instead)
export const IconButtonDefault: Story = {
  name: 'IconButton / Default',
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton icon={<Pencil size={18} />} aria-label="Edit transaction" />
      <IconButton icon={<Trash2 size={18} />} aria-label="Delete transaction" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Icon-only button used for edit and delete actions. `aria-label` is required and enforced by the TypeScript interface.',
      },
    },
  },
};

export const IconButtonDisabled: Story = {
  name: 'IconButton / Disabled',
  render: () => <IconButton icon={<Pencil size={18} />} aria-label="Edit transaction" disabled />,
  parameters: {
    docs: { description: { story: 'Disabled state — reduced opacity, no interaction.' } },
  },
};
```

> `IconButton` props differ from `Button` props, so a shared meta would not work. Render stories inside the `Button` meta are the right pattern here.

---

## Task 3 — Add component-level descriptions where missing

**WCAG / Storybook docs best practice:** Every component should have a `parameters.docs.description.component` string explaining its purpose, key props, and where it is used in the app.

Apply to the five files currently missing it:

### `Button.stories.tsx`

```tsx
parameters: {
  docs: {
    description: {
      component:
        'Primary interactive element. Supports `primary`, `secondary`, and `ghost` variants; three sizes; `loading` spinner state; optional left/right icons; and `fullWidth` for block-level layout.',
    },
  },
},
```

### `Input.stories.tsx`

```tsx
parameters: {
  docs: {
    description: {
      component:
        'Text input with optional label, helper text, error state, and left/right addons. Used inside `FormField` and directly in `TransactionForm`.',
    },
  },
},
```

Also add `argTypes` to `Input.stories.tsx`:

```tsx
argTypes: {
  error: { control: 'boolean', description: 'Applies error border and passes state to HelperText.' },
  disabled: { control: 'boolean' },
  label: { control: 'text' },
  helperText: { control: 'text', description: 'Hint or error message shown below the input.' },
  placeholder: { control: 'text' },
},
```

### `Modal.stories.tsx`

```tsx
parameters: {
  layout: 'centered',
  docs: {
    description: {
      component:
        'Accessible dialog overlay. Traps focus on open, restores it on close, closes on Escape or backdrop click. Used as the base for `ConfirmTransactionModal`, `DeleteTransactionModal`, and `EditTransactionModal`.',
    },
  },
},
```

### `Badge.stories.tsx`

```tsx
parameters: {
  docs: {
    description: {
      component:
        'Inline label used to identify the transaction type. Supports `income`, `expense`, and `transfer` variants with an optional leading dot indicator.',
    },
  },
},
```

### `TransactionForm.stories.tsx`

```tsx
parameters: {
  docs: {
    description: {
      component:
        'Controlled form for creating and editing transactions. Uses React Hook Form + Zod for validation. Renders `Select`, `CurrencyInput`, `DatePicker`, and `Input`. Shared between `NewTransaction` and `EditTransactionModal`.',
    },
  },
},
```

### `FeedbackModal.stories.tsx`

```tsx
parameters: {
  layout: 'centered',
  docs: {
    description: {
      component:
        'Result feedback overlay shown after CRUD operations. Three types: `success` (close label: "Fechar"), `error` (close label: "Entendido"), `info` (close label: "OK"). Managed globally via `FeedbackContext`.',
    },
  },
},
```

---

## Task 4 — Add missing variant stories

### `Badge.stories.tsx` — `WithoutDot` variant

```tsx
export const WithoutDot: Story = {
  name: 'Without Dot',
  args: { variant: 'income', children: 'Income' },
  parameters: {
    docs: { description: { story: 'Badge without the leading dot indicator.' } },
  },
};
```

### `TransactionItem.stories.tsx` — `WithoutActions` variant

This is the state used on the home page recent transactions sidebar (`showActions={false}`):

```tsx
export const WithoutActions: Story = {
  name: 'Without Actions (Read-only)',
  args: {
    transaction: {
      id: '5',
      type: 'deposit',
      description: 'Salário mensal',
      amount: 5000,
      date: '2025-03-01',
    },
    showActions: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Read-only variant used in the home page recent transactions sidebar — no edit or delete buttons.',
      },
    },
  },
};
```

---

## Task 5 — Upgrade `a11y` test mode

**File:** `.storybook/preview.ts`

**Problem:** `test: 'todo'` logs violations in the Accessibility panel but does not fail Storybook tests. With the a11y work from Days 43-45 applied, violations should be errors.

```ts
// Before
a11y: {
  test: 'todo',
},

// After
a11y: {
  test: 'error',
},
```

> After changing this, run `npm run storybook` and open the Accessibility panel on each story. Any red violations are now real failures to fix. The Days 43-45 changes should have resolved the main ones — this step confirms it.

---

## Task 6 (Day 54) — Smoke test all stories

Run Storybook locally and open every story:

```bash
npm run storybook
```

Go through each story in the sidebar. Check:

- [ ] `UI/Button` — all variants render; `IconButton/Default` and `IconButton/Disabled` appear
- [ ] `UI/Input` — `WithSuccess` story is gone; `WithHelperText` appears; `WithError` shows red border + helper text
- [ ] `UI/Select` — all stories render; opening the dropdown works; note keyboard nav in story descriptions if added
- [ ] `UI/Modal` — all three variants open/close correctly; Escape closes
- [ ] `UI/FeedbackModal` — `Success` button says "Fechar", `Error` button says "Entendido", `Info` button says "OK" (verifies Day 49-50 changes)
- [ ] `UI/Badge` — `WithoutDot` appears; all variants render
- [ ] `UI/Skeleton` / `UI/EmptyState` — render correctly
- [ ] `Features/TransactionList` — `Empty` story shows `EmptyState` component (verifies Day 49 change)
- [ ] `Features/TransactionItem` — `WithoutActions` appears; no edit/delete buttons visible
- [ ] `Features/TransactionForm` — all four stories render; `Submitting` shows spinner
- [ ] `Features/BalanceCard` — `NegativeBalance` shows red amount
- [ ] All modal stories (`ConfirmTransactionModal`, `DeleteTransactionModal`, `EditTransactionModal`) — open/close correctly

Console must show no React warnings or unhandled errors for any story.

---

## Task 7 (Day 54) — a11y panel audit

With `test: 'error'` active, the Accessibility tab will highlight any violations as failures.

Open the Accessibility panel for each story below and confirm it is green:

| Story                            | Common violation to check           |
| -------------------------------- | ----------------------------------- |
| `UI/Input → WithError`           | `aria-invalid` present on input     |
| `UI/CurrencyInput → WithError`   | same                                |
| `UI/Select → WithError`          | `aria-invalid` or error announced   |
| `UI/Modal → WithTitle`           | focus moves into modal on open      |
| `UI/Button → all`                | sufficient color contrast           |
| `Features/TransactionItem → all` | `aria-label` on edit/delete buttons |

If any story fails, trace it back to the component and apply the fix from the Day 43-45 doc.

---

## Task 8 (Day 54) — Publish

Two options — pick one:

### Option A: Chromatic (recommended — already installed)

`@chromatic-com/storybook` is in the addons and the package is installed.

1. Create a free account at [chromatic.com](https://www.chromatic.com)
2. Create a project, copy the project token
3. Run:

```bash
npx chromatic --project-token=<YOUR_TOKEN>
```

4. Chromatic publishes the Storybook and provides a public URL to include in the README and demo video.

### Option B: GitHub Pages (no account needed)

1. Build the static output:

```bash
npm run build-storybook
# outputs to storybook-static/
```

2. Push `storybook-static/` to the `gh-pages` branch:

```bash
npx gh-pages -d storybook-static
```

3. Enable GitHub Pages in the repository settings → Source: `gh-pages` branch.

4. The Storybook URL will be `https://<username>.github.io/<repo>/`.

> Whichever option is chosen, add the published URL to the README under a "Design System" section.

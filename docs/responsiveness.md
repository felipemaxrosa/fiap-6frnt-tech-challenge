# Responsiveness Reference — Mobile First

## Overview

All components in this project follow a **mobile-first** approach: the default (unprefixed) Tailwind classes define the mobile layout, and breakpoint prefixes (`sm:`, `md:`, `lg:`) progressively enhance the layout for larger screens.

> Write mobile styles first, then override upward. Never design for desktop and work down.

---

## Breakpoint table

| Prefix   | Min-width | Target device                  |
| -------- | --------- | ------------------------------ |
| _(none)_ | 0px       | Mobile (default)               |
| `sm:`    | 640px     | Landscape phone / small tablet |
| `md:`    | 768px     | Tablet                         |
| `lg:`    | 1024px    | Laptop / desktop               |
| `xl:`    | 1280px    | Wide desktop                   |

> The project primarily uses `sm:` and `md:`. `lg:` is used for max-width containers.

---

## Mobile-first rule in Tailwind

```tsx
// CORRECT — mobile first
<div className="flex flex-col sm:flex-row gap-3">
  {/* stacks vertically on mobile, horizontal on sm+ */}
</div>

// WRONG — desktop first (avoid)
<div className="flex flex-row max-sm:flex-col gap-3">
  {/* do not use max-sm: to override downward */}
</div>
```

---

## Common responsive patterns

### 1 — Full width on mobile, constrained on larger screens

```tsx
<div className="w-full max-w-5xl mx-auto px-4">{/* content */}</div>
```

### 2 — Stack vertically on mobile, side by side on sm+

```tsx
<div className="flex flex-col gap-3 sm:flex-row">
  <aside>…</aside>
  <main className="flex-1">…</main>
</div>
```

### 3 — Single column grid on mobile, multi-column on sm+

```tsx
<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{/* used in TransactionSummary */}</div>
```

### 4 — Show/hide by breakpoint

```tsx
{
  /* visible only on sm+ */
}
<nav className="hidden sm:flex gap-6">…</nav>;

{
  /* visible only on mobile */
}
<button className="sm:hidden">…</button>;
```

### 5 — Responsive text size

```tsx
<span className="text-2xl font-bold md:text-3xl">{balance}</span>
```

### 6 — Responsive padding

```tsx
<div className="px-4 md:px-8 lg:px-12">{/* tighter on mobile, looser on desktop */}</div>
```

---

## Per-component responsive summary

| Component              | Mobile default                                  | sm+ (640px+)                          | md+ (768px+)       |
| ---------------------- | ----------------------------------------------- | ------------------------------------- | ------------------ |
| **Button**             | Full width via `fullWidth` prop; default inline | —                                     | —                  |
| **Input**              | `w-full`                                        | —                                     | —                  |
| **Badge**              | Inline, no changes                              | —                                     | —                  |
| **Card**               | `w-full` within parent                          | —                                     | —                  |
| **Select**             | `w-full`                                        | —                                     | —                  |
| **CurrencyInput**      | `w-full`                                        | —                                     | —                  |
| **DatePicker**         | `w-full`                                        | —                                     | —                  |
| **FormField**          | Vertical stack (column)                         | —                                     | —                  |
| **TransactionItem**    | Flex row, description truncates                 | —                                     | —                  |
| **TransactionList**    | Vertical stack                                  | —                                     | —                  |
| **BalanceCard**        | `w-full`, `text-2xl` balance                    | —                                     | `text-3xl` balance |
| **TransactionSummary** | `grid-cols-1`                                   | `grid-cols-3`                         | —                  |
| **Header**             | Hamburger menu, nav hidden                      | Desktop nav visible, hamburger hidden | —                  |
| **Modal**              | Full-width panel (`w-full`), `p-4` outer        | Constrained by `max-w-sm/md/lg`       | —                  |
| **EmptyState**         | Centered column, full width                     | —                                     | —                  |
| **LoadingSpinner**     | Centered inline                                 | —                                     | —                  |
| **Skeleton**           | `w-full` within parent                          | —                                     | —                  |

---

## Page-level layout example

The app shell (`app/layout.tsx`) uses a max-width container to center content on wider screens while padding the sides on mobile:

```tsx
// app/layout.tsx
<body>
  <Header />
  <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">{children}</main>
</body>
```

The Home page stacks sections vertically on mobile and can optionally switch to a two-column layout on `md+`:

```tsx
// app/page.tsx
<div className="flex flex-col gap-6">
  <BalanceCard balance={balance} owner="Felipe" />
  <TransactionSummary transactions={transactions} />
  <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
</div>
```

---

## Storybook: testing responsiveness

Use the **Storybook viewport addon** to preview components at different screen widths. For components with explicit breakpoint behavior (Header, TransactionSummary), add a `parameters.viewport` block to the story:

```tsx
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' }, // 320px
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' }, // 768px
  },
};
```

---

## Checklist

- [ ] All base styles are written without a breakpoint prefix (mobile default)
- [ ] `sm:` used to enhance layout from 640px upward
- [ ] No `max-sm:` or `max-md:` used for overriding downward
- [ ] Page layout uses `max-w-5xl mx-auto px-4` container
- [ ] `TransactionSummary` uses `grid-cols-1 sm:grid-cols-3`
- [ ] `Header` hides desktop nav on mobile and shows hamburger toggle
- [ ] `BalanceCard` balance amount grows from `text-2xl` to `md:text-3xl`
- [ ] Modal uses `w-full` plus `max-w-*` to adapt to screen width
- [ ] Storybook viewport stories added for components with layout breakpoints

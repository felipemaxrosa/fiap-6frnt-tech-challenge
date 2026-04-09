# Day 3-4: Design System Foundation

## Goals

- Define design tokens: colors, typography, spacing, shadows
- Create the base theme file (`app/tokens.css`)
- Study the Figma reference and extract values

---

## Step 1 — Study the Figma Reference

Open the [Projeto Financeiro Figma file](https://www.figma.com/design/ns5TC3X5Xr8V7I3LYKg9KA/Projeto-Financeiro?node-id=503-4264&t=gZy56WDAUfXtS23Y-1) and extract the following:

### What to look for in Figma

| Category          | What to collect                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------ |
| **Colors**        | Brand primary, background, surface, text, border, status colors (success, danger, warning) |
| **Typography**    | Font family, font sizes (xs → xl), font weights, line heights                              |
| **Spacing**       | Base unit (usually 4px or 8px), common spacing values used in components                   |
| **Shadows**       | Card shadow, modal shadow, dropdown shadow                                                 |
| **Border radius** | Button radius, card radius, input radius                                                   |

> Tip: In Figma, click on any element → inspect panel on the right shows the exact CSS values (hex colors, px sizes, box-shadow).

---

## Step 2 — Create `app/tokens.css`

Create the file `app/tokens.css` and define all tokens using Tailwind v4's `@theme` block.

```css
/* app/tokens.css */

@theme {
  /* ============================================
     COLORS — Palette (raw values)
     ============================================ */
  --color-blue-50: #eff6ff;
  --color-blue-100: #dbeafe;
  --color-blue-600: #2563eb;
  --color-blue-700: #1d4ed8;

  --color-green-500: #22c55e;
  --color-green-600: #16a34a;

  --color-red-500: #ef4444;
  --color-red-600: #dc2626;

  --color-yellow-500: #eab308;

  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* ============================================
     COLORS — Semantic tokens (reference palette)
     ============================================ */

  /* Brand */
  --color-primary: var(--color-blue-600);
  --color-primary-hover: var(--color-blue-700);
  --color-primary-light: var(--color-blue-50);

  /* Backgrounds */
  --color-bg-page: var(--color-gray-50);
  --color-surface: #ffffff;
  --color-surface-hover: var(--color-gray-100);

  /* Text */
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-500);
  --color-text-muted: var(--color-gray-400);
  --color-text-inverse: #ffffff;

  /* Borders */
  --color-border: var(--color-gray-200);
  --color-border-focus: var(--color-blue-600);

  /* Status — Transaction types */
  --color-income: var(--color-green-600);
  --color-income-bg: #f0fdf4;
  --color-expense: var(--color-red-600);
  --color-expense-bg: #fef2f2;
  --color-transfer: var(--color-yellow-500);
  --color-transfer-bg: #fefce8;

  /* ============================================
     TYPOGRAPHY
     ============================================ */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 1.875rem; /* 30px */

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* ============================================
     SPACING — extends Tailwind defaults
     ============================================ */
  --spacing-18: 4.5rem; /* 72px */
  --spacing-22: 5.5rem; /* 88px */
  --spacing-88: 22rem; /* 352px — sidebar width */
  --spacing-112: 28rem; /* 448px — modal width */

  /* ============================================
     BORDER RADIUS
     ============================================ */
  --radius-sm: 0.25rem; /* 4px  — badges, tags */
  --radius-md: 0.5rem; /* 8px  — inputs, buttons */
  --radius-lg: 0.75rem; /* 12px — cards */
  --radius-xl: 1rem; /* 16px — modals */
  --radius-full: 9999px; /* pills */

  /* ============================================
     SHADOWS
     ============================================ */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-card-hover: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-modal: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-dropdown: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
```

---

## Step 3 — Import tokens in `globals.css`

Update `app/globals.css` to import the tokens file:

```css
@import 'tailwindcss';
@import './tokens.css';

/* Global base styles */
body {
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}
```

---

## Step 4 — How to use tokens in components

Tailwind v4 auto-generates utility classes from every `@theme` variable. Examples:

```tsx
// Colors
<div className="bg-surface text-text-primary border border-border" />
<span className="text-income bg-income-bg" />
<span className="text-expense bg-expense-bg" />

// Shadows
<div className="shadow-card hover:shadow-card-hover" />

// Border radius
<button className="rounded-md" />
<div className="rounded-lg shadow-card" />

// Typography
<h1 className="text-2xl font-semibold leading-tight" />
<p className="text-sm text-text-secondary" />
```

---

## Step 5 — Update the Storybook preview to load tokens

Edit `.storybook/preview.ts` to import `globals.css` so all stories render with the design tokens applied:

```ts
// .storybook/preview.ts
import '../app/globals.css';
import type { Preview } from '@storybook/nextjs-vite';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'page',
      values: [
        { name: 'page', value: '#f9fafb' },
        { name: 'surface', value: '#ffffff' },
        { name: 'dark', value: '#111827' },
      ],
    },
  },
};

export default preview;
```

---

## Checklist

- [ ] Extracted colors, typography, spacing, and shadows from Figma
- [ ] Created `app/tokens.css` with `@theme` block
- [ ] Imported `tokens.css` in `globals.css`
- [ ] Verified Tailwind generates utility classes (`bg-primary`, `text-income`, etc.)
- [ ] Updated Storybook `preview.ts` to load global styles
- [ ] Tokens render correctly in the running app and Storybook

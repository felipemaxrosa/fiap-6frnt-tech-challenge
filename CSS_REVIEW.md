# Revisão de CSS: `globals.css` & `tokens.css`

> Revisado por: Engenheiro Frontend
> Projeto: Bytebank (Next.js 16 + Tailwind CSS v4)
> Escopo: `app/globals.css` e `app/tokens.css`

---

## Resumo

A estrutura de design tokens é sólida e demonstra uma intenção clara. Porém, existem **bugs críticos** no `globals.css` que causam conflitos com as utilitárias nativas do Tailwind, além de **tokens faltando** que serão necessários para implementar fielmente o design da home. Abaixo está a lista de achados por prioridade.

---

## Problemas Críticos

### 1. Referências circulares com `@apply` no `globals.css`

Várias classes utilitárias personalizadas têm o mesmo nome que utilitárias nativas do Tailwind e, em seguida, fazem `@apply` dessas mesmas utilitárias — isso cria uma referência circular e gera comportamento indefinido.

```css
/* ❌ QUEBRADO — .text-2xl tenta @apply em si mesma */
.text-2xl {
  @apply text-2xl font-bold;
}

/* ❌ Mesmo problema em todas estas */
.text-xl {
  @apply text-xl   font-normal;
}
.text-lg {
  @apply text-lg   font-normal;
}
.text-base {
  @apply text-base font-normal;
}
.text-sm {
  @apply text-sm   font-normal;
}
```

**Por que quebra:** O Tailwind processa o `@apply` resolvendo a classe referenciada. Quando o nome da classe é igual ao da própria regra, os processadores CSS (PostCSS / Lightning CSS, usado pelo Tailwind v4) lançam um erro ou geram uma regra vazia.

**Correção — Opção A (renomear):** Use um prefixo do projeto para evitar colisões:

```css
/* ✅ Sem colisão — prefixo "bb-" de Bytebank */
.bb-text-2xl {
  @apply text-2xl  font-bold;
}
.bb-text-xl {
  @apply text-xl   font-normal;
}
```

**Correção — Opção B (recomendada para Tailwind v4):** Remover completamente esses wrappers e compor as classes diretamente no JSX:

```tsx
// ✅ Idiomático no Tailwind v4 — sem layer customizada necessária
<h1 className="text-2xl font-bold">Olá, Joana! :)</h1>
```

A Opção B é preferível pois mantém os estilos co-localizados com o markup, é tree-shakeable e não luta contra o framework.

---

## Melhorias de Alta Prioridade

### 2. Tokens faltando visíveis no design da home

O design possui vários padrões visuais sem tokens correspondentes, forçando desenvolvedores a usar valores hardcoded.

| Token faltando                       | Onde aparece no design                          | Valor sugerido                                                                                                |
| ------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `--radius-default`                   | Cards, badges, inputs, botão — todos usam `8px` | `8px`                                                                                                         |
| `--color-brand-card`                 | Card do cabeçalho escuro (fundo navy)           | já existe como `--color-brand-dark` ✓                                                                         |
| `--shadow-card`                      | Elevação sutil nos cards brancos                | `0 4px 4px 0 rgba(0,0,0,0.25)`                                                                                |
| `--color-border-input`               | Borda padrão de inputs e selects (roxo)         | `var(--color-brand-primary)`                                                                                  |
| `--color-border-default`             | Bordas neutras — divisores, separadores         | `#e2e4ed`                                                                                                     |
| `--color-button-primary-bg`          | Fundo do botão "Concluir transação"             | `var(--color-brand-primary)`                                                                                  |
| `--color-button-primary-text`        | Texto do botão primário                         | `var(--color-content-inverse)`                                                                                |
| `--color-button-primary-hover`       | Hover do botão primário                         | `#5535cc` (~15% mais escuro)                                                                                  |
| `--color-button-primary-disabled-bg` | Estado desabilitado do botão                    | `#c4b8f9` (brand-primary dessaturado)                                                                         |
| `--color-icon-default`               | Ícones de ação (lápis, lixeira)                 | `var(--color-content-primary)`                                                                                |
| `--color-icon-accent`                | Ícone do olho + separador "Saldo"               | `var(--color-feedback-danger)`                                                                                |
| `--color-placeholder`                | Texto placeholder nos inputs                    | `var(--color-content-secondary)`                                                                              |
| `--color-badge-withdraw-bg`          | Fundo do badge "Saque"                          | `rgba(242, 72, 34, 0.10)` (`#F24822` a 10%)                                                                   |
| `--color-badge-withdraw-text`        | Texto do badge "Saque"                          | `#F24822` (100%) — Figma usa `--color-warning`, mas mantemos padrão `--color-badge-*` para consistência do DS |
| `--color-badge-transfer-bg`          | Fundo do badge "Transação"                      | `rgba(104, 65, 242, 0.10)` (`#6841F2` a 10%)                                                                  |
| `--color-badge-transfer-text`        | Texto do badge "Transação"                      | `#6841F2` (100%)                                                                                              |
| `--color-badge-deposit-bg`           | Fundo do badge "Depósito"                       | `rgba(31, 228, 113, 0.10)` (`#1FE471` a 10%)                                                                  |
| `--color-badge-deposit-text`         | Texto do badge "Depósito"                       | `#1CC060` (100%) — já existe como `--color-feedback-success` ✓                                                |

> **Nomenclatura de cor no Figma vs DS:** O Figma referencia `var(--color-black, #000B34)` para o texto principal dos itens de transação ("Supermercado"). Nosso DS já cobre esse valor com `--color-content-primary: #000B34` — nenhum token novo necessário, mas o time deve usar `--color-content-primary` no código e não criar um `--color-black` separado para evitar duplicidade.

> **Tipografia dos badges:** O Figma especifica `Inter 13px / 600` para o texto de todos os badges. Isso mapeia para os tokens já existentes `--text-sm` (0.8125rem) + `font-semibold`. O `--text-sm` definido no `@theme` gera automaticamente a utility `text-sm` no Tailwind v4, portanto nenhum token novo é necessário — basta compor no JSX:
>
> ```tsx
> <span className="text-sm font-semibold">Saque</span>
> ```
>
> O texto principal do card ("Supermercado") usa `Inter 16px / 600` + `overflow: hidden; text-overflow: ellipsis` → use `text-base font-semibold truncate` no JSX. A utility `truncate` do Tailwind aplica `overflow-hidden`, `text-ellipsis` e `whitespace-nowrap` em uma única classe.

**Adicionar ao `tokens.css`:**

```css
@theme {
  /* ... tokens existentes ... */

  /* ============================================
  BORDER RADIUS
  ============================================ */
  --radius-default: 8px; /* cards, badges, inputs, botões */

  /* ============================================
  SOMBRAS
  ============================================ */
  --shadow-card: 0 4px 4px 0 rgba(0, 0, 0, 0.25); /* conforme Figma */

  /* ============================================
  BORDER COLORS
  ============================================ */
  --color-border-input: var(--color-brand-primary);
  --color-border-default: #e2e4ed;

  /* ============================================
  BUTTON COLORS
  ============================================ */
  --color-button-primary-bg: var(--color-brand-primary);
  --color-button-primary-text: var(--color-content-inverse);
  --color-button-primary-hover: #5535cc;
  --color-button-primary-disabled-bg: #c4b8f9;
  --color-button-primary-disabled-text: #ffffff;

  /* ============================================
  ICON COLORS
  ============================================ */
  --color-icon-default: var(--color-content-primary);
  --color-icon-secondary: var(--color-content-secondary);
  --color-icon-accent: var(--color-feedback-danger);

  /* ============================================
  FORM COLORS
  ============================================ */
  --color-placeholder: var(--color-content-secondary);

  /* ============================================
  CORES DE BADGE
  ============================================ */
  --color-badge-transfer-bg: rgba(104, 65, 242, 0.1); /* #6841F2 a 10% */
  --color-badge-transfer-text: #6841f2;
  --color-badge-withdraw-bg: rgba(242, 72, 34, 0.1); /* #F24822 a 10% */
  --color-badge-withdraw-text: #f24822;
  --color-badge-deposit-bg: rgba(31, 228, 113, 0.1); /* #1FE471 a 10% */
  --color-badge-deposit-text: #1cc060; /* reutiliza --color-feedback-success */
}
```

---

### 3. Tokens de espaçamento em `px` — prefira `rem` por acessibilidade

Todos os tokens de espaçamento estão declarados em `px`, o que ignora a preferência de tamanho de fonte do navegador do usuário (requisito WCAG 1.4.4).

```css
/* ❌ Ignora a preferência de fonte do usuário */
--spacing-sm: 8px;

/* ✅ Escala com o tamanho de fonte raiz */
--spacing-sm: 0.5rem; /* 8px com root de 16px padrão */
```

A regra `html { font-size: clamp(...) }` já define um tamanho raiz fluido, então converter o espaçamento para `rem` faz com que todo o layout escale proporcionalmente.

| Token          | px   | rem     |
| -------------- | ---- | ------- |
| `--spacing-xs` | 4px  | 0.25rem |
| `--spacing-sm` | 8px  | 0.5rem  |
| `--spacing-md` | 12px | 0.75rem |
| `--spacing-lg` | 24px | 1.5rem  |
| `--spacing-xl` | 32px | 2rem    |

---

### 4. Fórmula do `clamp()` precisa de revisão

```css
html {
  font-size: clamp(14px, 1.8vw, 16px);
}
```

`1.8vw` equivale a `16px` somente em um viewport de ~889px. Em 1440px atinge o máximo de 16px (correto), mas em 375px (mobile) resulta em `6.75px`, bem abaixo do mínimo de `14px`. O floor do clamp protege contra isso, mas o valor do meio nunca contribui de forma significativa no mobile. Uma fórmula mais útil:

```css
/* Fluido de 375px (14px) → 1280px (16px) */
html {
  font-size: clamp(0.875rem, 0.8rem + 0.417vw, 1rem);
}
```

Usa clamp baseado em `rem` (evita o bug do iOS Safari com px no clamp) e produz uma escala suave entre os breakpoints onde realmente importa.

---

## Melhorias de Média Prioridade

### 5. Embutir font-weight no nome da classe quebra a composabilidade

```css
/* ❌ Força bold — não pode ser sobrescrito sem hacks de especificidade */
.text-xl-bold {
  @apply text-xl font-bold;
}
.text-xl-semibold {
  @apply text-xl font-semibold;
}
.text-xl {
  @apply text-xl font-normal;
}
```

Esse padrão prolifera variantes de classe para cada combinação de peso e torna impossível alterar o peso contextualmente. O Tailwind foi projetado para composição:

```tsx
/* ✅ Composável — tamanho e peso são independentes */
<p className="text-xl font-bold">Título</p>
<p className="text-xl font-semibold">Subtítulo</p>
<p className="text-xl">Corpo</p>
```

Se precisar de atalhos semânticos, use o layer `@layer components` com nomes baseados em papel (não combinações de tamanho+peso):

```css
/* ✅ Semântico, não mecânico */
@layer components {
  .heading-page {
    @apply text-2xl font-bold;
  }
  .heading-section {
    @apply text-xl font-semibold;
  }
  .body-default {
    @apply text-base font-normal;
  }
  .label-form {
    @apply text-sm font-semibold;
  }
}
```

---

### 6. Tokens de dark mode faltando

O design é atualmente apenas light, mas o `@theme` do Tailwind v4 suporta tokens de variante dark mode. Defini-los agora evita um refactor custoso no futuro:

```css
@theme {
  /* light (padrão) */
  --color-background: #f3f3f3;
  --color-content-primary: #000b34;
}

/* sobrescritas do dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0d0f1a;
    --color-content-primary: #f3f3f3;
  }
}
```

---

### 7. `@layer utilities` é o layer errado para essas regras

Classes utilitárias personalizadas que definem múltiplas propriedades (font-size + font-weight) são funcionalmente **componentes**, não utilitárias. No sistema de layers do Tailwind:

- `utilities` → propriedade única, composável (ex: `font-bold`)
- `components` → múltiplas propriedades, padrões reutilizáveis (ex: `.btn-primary`)

Usar o layer errado causa surpresas de especificidade. Mova os helpers de texto para `@layer components`.

```css
/* ❌ layer errado — especificidade imprevista */
@layer utilities {
  .text-xl-bold {
    @apply text-xl font-bold;
  }
}

/* ✅ layer correto */
@layer components {
  .text-xl-bold {
    @apply text-xl font-bold;
  }
}
```

Na prática, um `@layer utilities` tem menor especificidade que `@layer components`, então uma classe `font-normal` aplicada depois no JSX **não conseguiria sobrescrever** um helper definido em `utilities` — gerando comportamento confuso difícil de depurar.

---

### 8. Sem tokens de foco/interação

Os elementos interativos do design (input, botão, dropdown) precisam de focus rings consistentes. O Tailwind v4 permite estilos de foco baseados em tokens:

```css
@theme {
  --color-focus-ring: var(--color-brand-primary); /* referencia o token, não hardcode */
  --color-focus-ring-offset: #ffffff;
}
```

E nos estilos globais:

```css
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

---

## Baixa Prioridade / Nice to Have

### 9. Valores de `--color-surface` e `--color-background` estão invertidos ⚠️ Confirmado

O design do Extrato confirma: o **fundo da página é cinza** e os **cards de transação são brancos**. Mas o `globals.css` define:

```css
body {
  background: var(--color-background); /* #ffffff — branco */
}
```

Isso significa que o body da página é branco, enquanto o design mostra uma página cinza. Na prática, os desenvolvedores vão aplicar `--color-surface` (`#f3f3f3`) na página e `--color-background` (`#ffffff`) nos cards — o **oposto** do que os nomes sugerem.

Os nomes devem refletir seu papel semântico real:

| Token atual          | Valor atual | Problema                                | Renomeação sugerida      |
| -------------------- | ----------- | --------------------------------------- | ------------------------ |
| `--color-background` | `#ffffff`   | Usado para **cards**, não para a página | `--color-surface-raised` |
| `--color-surface`    | `#f3f3f3`   | Usado como **fundo da página**          | `--color-background`     |

Ou de forma mais explícita:

```css
--color-bg-page: #f3f3f3; /* cinza — canvas geral da página */
--color-bg-card: #ffffff; /* branco — cards e painéis */
```

E atualizar o `globals.css`:

```css
body {
  background: var(--color-bg-page);
}
```

---

### 10. Token de transição faltando

Botões e elementos interativos do design provavelmente terão animações. Uma duração compartilhada evita inconsistências:

```css
@theme {
  --transition-default: 150ms ease-in-out;
}
```

---

## Checklist por Arquivo

### `tokens.css`

- [ ] Corrigir valores invertidos: `--color-background: #f3f3f3` e `--color-surface: #ffffff` ⚠️ Confirmado
- [ ] Adicionar `--radius-default: 8px`
- [ ] Adicionar `--shadow-card: 0 4px 4px 0 rgba(0,0,0,0.25)` (valor do Figma)
- [ ] Adicionar tokens de badge (bg + text) para Transação, Saque e Depósito
- [ ] Adicionar tokens de border (`--color-border-input`, `--color-border-default`)
- [ ] Adicionar tokens de button (bg, text, hover, disabled)
- [ ] Adicionar tokens de icon (`--color-icon-default`, `--color-icon-accent`)
- [ ] Adicionar `--color-placeholder`
- [ ] Remover `--color-feedback-warning` — duplicata de `--color-feedback-danger` (#F24822)
- [ ] Converter espaçamentos de `px` para `rem`
- [ ] Adicionar tokens de focus ring (`--color-focus-ring`)
- [ ] Adicionar token de transição (`--transition-default`)
- [ ] Adicionar bloco de tokens para dark mode

### `globals.css`

- [ ] Corrigir as 5 classes `@apply` circulares — crítico (renomear ou remover em favor de composição no JSX)
- [ ] Mover helpers de texto para `@layer components` (ou deletar em favor de composição no JSX)
- [ ] Corrigir fórmula do `clamp()` para `clamp(0.875rem, 0.8rem + 0.417vw, 1rem)`
- [ ] Adicionar regra global `:focus-visible` usando `--color-focus-ring`
- [ ] Atualizar `body { background }` para usar `--color-background` (após corrigir os valores invertidos)
- [ ] Remover o bloco `@layer utilities` se ficar vazio após as mudanças acima

---

## Ordem de Execução (Quick Wins)

1. **Corrigir `@apply` circular (globals.css)** — quebra os estilos silenciosamente hoje
2. **Corrigir valores invertidos de `--color-background` e `--color-surface` (tokens.css)** — afeta o fundo de toda a aplicação; atualizar `body { background }` no globals.css em seguida
3. **Adicionar `--radius-default` e `--shadow-card` (tokens.css)** — necessário para todos os cards do design
4. **Adicionar tokens de badge (tokens.css)** — necessário para a seção Extrato
5. **Adicionar tokens de border, button, icon e placeholder (tokens.css)** — necessário para inputs, selects e botão "Concluir transação"
6. **Remover `--color-feedback-warning` (tokens.css)** — duplicata de `--color-feedback-danger`, evita confusão no DS
7. **Mover helpers de texto para `@layer components` ou deletar em favor de composição no JSX (globals.css)** — corrige especificidade e manutenibilidade
8. **Converter espaçamentos de `px` para `rem` (tokens.css)** — acessibilidade + layout fluido
9. **Adicionar tokens de focus ring + regra `:focus-visible` global (tokens.css + globals.css)** — acessibilidade de teclado
10. **Corrigir fórmula do `clamp()` (globals.css)** — compatibilidade cross-browser e mobile
11. **Adicionar `--transition-default` (tokens.css)** — consistência de animações
12. **Adicionar bloco de dark mode (tokens.css)** — preparação para futuro suporte

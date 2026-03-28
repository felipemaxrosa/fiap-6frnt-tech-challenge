# Day 55-56: README

> **Depends on:**
>
> - **Day 53-54 (Storybook)** must be complete so the published Storybook URL is available to drop into the Design System section.
> - The app must be visually stable (Phase 4 complete) before taking screenshots for Day 56.

## Goal

Replace the boilerplate `create-next-app` README with project-specific documentation covering all challenge requirements: purpose, prerequisites, setup, env vars, structure, tech stack, and screenshots.

---

## Current state

`README.md` is the default `create-next-app` template — Next.js generic content, no project context. It must be fully replaced.

---

## Execution Order

| Day    | Tasks                                                |
| ------ | ---------------------------------------------------- |
| **55** | Write the complete README (sections 1-7 below)       |
| **56** | Take screenshots · drop them in · final read-through |

---

## Day 55 — Write the README

Replace `README.md` entirely with the following. Fill in the two placeholders marked `<!-- FILL -->` on Day 56.

````markdown
# Bytebank — Gerenciamento Financeiro

Frontend de gestão financeira pessoal construído com Next.js e Design System próprio, desenvolvido como tech challenge da FIAP Frontend Engineering.

<!-- FILL: screenshot da home page -->

## Funcionalidades

- **Dashboard**: saldo da conta com toggle de visibilidade e transações recentes
- **Lista de transações**: filtros por tipo, intervalo de datas e ordenação; persiste na URL
- **CRUD completo**: adicionar, editar e excluir transações com modais de confirmação e feedback
- **Design System**: componentes documentados no Storybook com tokens de cor, tipografia e espaçamento

---

## Pré-requisitos

| Ferramenta | Versão mínima |
| ---------- | ------------- |
| Node.js    | 20+           |
| npm        | 10+           |

---

## Instalação e execução

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd tech-challenge
```
````

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Este comando inicia simultaneamente:

- **Next.js** em `http://localhost:3000`
- **json-server** (mock API) em `http://localhost:3001`

> O json-server assiste o arquivo `data/transactions.json` e expõe uma REST API completa. A aplicação não funciona sem ele rodando.

---

## Scripts disponíveis

| Comando                   | Descrição                                            |
| ------------------------- | ---------------------------------------------------- |
| `npm run dev`             | Inicia Next.js + json-server simultaneamente         |
| `npm run build`           | Build de produção                                    |
| `npm start`               | Inicia o servidor de produção (requer `build` antes) |
| `npm run api`             | Inicia apenas o json-server                          |
| `npm run storybook`       | Abre o Storybook em `http://localhost:6006`          |
| `npm run build-storybook` | Gera o Storybook estático em `storybook-static/`     |
| `npm run lint`            | Executa o ESLint                                     |
| `npm run format`          | Formata todos os arquivos com Prettier               |

---

## Variáveis de ambiente

| Variável              | Obrigatória | Descrição                          | Valor padrão            |
| --------------------- | ----------- | ---------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Sim         | URL base da API mock (json-server) | `http://localhost:3001` |

---

## Estrutura do projeto

```
tech-challenge/
├── app/
│   ├── page.tsx                  # Home — saldo, nova transação, recentes
│   ├── transactions/
│   │   └── page.tsx              # Listagem completa com filtros
│   └── layout.tsx                # Root layout — providers, Header, Sidebar
│
├── components/
│   ├── ui/                       # Átomos do Design System
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Modal/
│   │   ├── FeedbackModal/
│   │   └── ...
│   └── features/                 # Componentes de feature compostos
│       ├── TransactionForm/
│       ├── TransactionList/
│       ├── TransactionItem/
│       ├── BalanceCard/
│       ├── EditTransactionModal/
│       └── ...
│
├── context/
│   ├── TransactionsContext.tsx   # Estado global de transações + CRUD
│   └── FeedbackContext.tsx       # Estado global do FeedbackModal
│
├── hooks/
│   └── useTransactionFilters.ts  # Filtro e ordenação com persistência em URL
│
├── lib/
│   └── transactions.ts           # Helpers puros: getAll, calculateBalance, getRecent
│
├── services/                     # TransactionService — chamadas HTTP ao json-server
├── data/
│   └── transactions.json         # Dados mock (lidos e escritos pelo json-server)
├── types/
│   └── index.ts                  # Transaction, TransactionType, Account
├── shared/                       # Constantes e utilitários de formatação
└── .storybook/                   # Configuração do Storybook
```

---

## Tech stack

| Preocupação          | Escolha                 | Motivo                                                              |
| -------------------- | ----------------------- | ------------------------------------------------------------------- |
| Framework            | Next.js 16 (App Router) | Exigência do challenge                                              |
| Linguagem            | TypeScript              | Type safety, melhor DX e autocompletar                              |
| Estilização          | Tailwind CSS v4         | Utility-first, iteração rápida, integração nativa com Design System |
| Design System        | Custom + Storybook      | Exigência do challenge; tokens CSS para consistência visual         |
| Gerenciamento estado | React Context API       | Escopo adequado ao app; sem dependências extras                     |
| Formulários          | React Hook Form + Zod   | Validação leve com inferência de tipos a partir do schema           |
| Mock backend         | json-server             | REST API zero-config sobre arquivo JSON                             |
| Ícones               | Lucide React            | Consistente, tree-shakeable                                         |
| Testes               | Vitest + Playwright     | Testes de componente via addon Storybook                            |
| Commit hooks         | Husky + lint-staged     | Garante lint e formatação em todo commit                            |

---

## Design System

Biblioteca de componentes documentada com variantes, props, acessibilidade e exemplos interativos.

📖 **[Acessar Storybook →](<%3C!-- FILL: URL do Storybook publicado (Chromatic ou GitHub Pages) -->)**

Destaques:

- **Tokens de design**: cores, espaçamento, tipografia e sombras via CSS custom properties
- **Acessibilidade**: WCAG 2.1 AA — ARIA, navegação por teclado, foco gerenciado nos modais
- **Responsivo**: mobile-first — 375px · 768px · 1024px+

---

## Screenshots

### Home

<!-- FILL: screenshot da home page em desktop (1280px) -->

### Transações

<!-- FILL: screenshot da página de transações com filtros aplicados -->

### Modal — Nova transação

<!-- FILL: screenshot do modal de confirmação de nova transação -->

````

---

## Day 56 — Screenshots + final review

### Taking screenshots

Use Chrome DevTools device toolbar or a window resized to the target width.

| Screenshot | Viewport | What to capture |
|------------|----------|-----------------|
| Home (desktop) | 1280px | Full page — BalanceCard visible, recent transactions on the right |
| Home (mobile) | 375px | Stacked layout — BalanceCard + NewTransaction form visible |
| Transactions page | 1280px | Filters row + full transaction list |
| New transaction modal | 1280px | `ConfirmTransactionModal` open over the home page |
| FeedbackModal — success | 1280px | Green success modal after adding a transaction |

Save screenshots to a `docs/screenshots/` folder and reference them in the README with relative paths:

```markdown
![Home](docs/screenshots/home-desktop.png)
````

### Final review checklist

Read the completed README as if you are a first-time visitor to the repository.

- [ ] Clone, install, and `npm run dev` steps work exactly as written
- [ ] `NEXT_PUBLIC_API_URL` is documented — a developer without `.env.local` knows what to create
- [ ] Storybook URL is filled in and resolves
- [ ] All screenshots are present and render in the GitHub preview
- [ ] No mention of "Next.js boilerplate", Vercel deploy links, or `create-next-app` references remain
- [ ] Project name and description appear in the `<title>` of the repository (GitHub About field) — update if not set

---

## Note on language

The README above is written in **Portuguese** to match the project's target audience (FIAP / Brazilian assessors). If the evaluators expect English, translate the section headings and descriptions accordingly — the structure and content remain the same.

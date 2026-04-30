# NexAdmin — Production-Grade Admin Dashboard

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=react-query)
![License](https://img.shields.io/badge/license-MIT-green)

A **senior-level, portfolio-quality admin dashboard** built with Next.js 14 App Router, TypeScript, Tailwind CSS, Recharts, TanStack Query, Zustand, and React Hook Form + Zod. Every architectural decision mirrors patterns used in production SaaS products.

**[Live Demo →](https://nexadmin-demo.vercel.app)**

---

## ✨ Features

| Area | What's included |
|---|---|
| **Auth** | Mock JWT login/logout, httpOnly cookie, Zustand persistence, middleware guard |
| **Dashboard** | Stats cards, area revenue chart, donut traffic chart, user growth bar chart, activity feed |
| **User Management** | CRUD table with 47 mock records, pagination, search, role/status filters, bulk delete, sort |
| **Settings** | Profile form, notification toggles, danger zone — all validated with Zod |
| **Notifications** | Read/unread state, category filters, dismiss, mark-all-read |
| **UX** | Sidebar collapse, toast queue, focus-trapped modals, Escape-to-close, skeleton loaders |
| **a11y** | ARIA roles, aria-current, aria-sort, aria-live toasts, keyboard navigation |

---

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Route group — shared sidebar/header layout
│   │   ├── dashboard/      # Overview page
│   │   ├── users/          # User management (URL-driven filters)
│   │   ├── settings/       # Profile + notification forms
│   │   └── notifications/  # Activity notifications
│   ├── login/              # Public auth page
│   └── api/                # Route handlers (mock API — swap for Prisma/Drizzle)
│
├── components/
│   ├── ui/                 # Primitives: Button, Input, Select, Badge, Avatar, Skeleton
│   ├── layout/             # Sidebar, Header
│   ├── dashboard/          # StatsCard, RevenueChart, TrafficChart, ActivityFeed
│   ├── users/              # UserFormModal
│   └── shared/             # DataTable, Modal, Pagination, Toaster, EmptyState
│
├── lib/
│   ├── api/                # Typed API client + resource modules (users, dashboard)
│   ├── hooks/              # useAuth, useUsers, useDashboard, useDebounce
│   ├── store/              # Zustand: auth.store, ui.store
│   ├── utils/              # cn(), formatCurrency(), formatDate(), formatRelativeTime()
│   └── validations/        # Zod schemas for all forms
│
├── types/                  # Shared TypeScript interfaces
└── middleware.ts            # Edge auth guard + root redirect
```

### State Management Strategy

```
Server state  →  TanStack Query v5   (users list, dashboard stats — cached, background refetch)
Client state  →  Zustand             (auth session, sidebar, toast queue, modal state)
Form state    →  React Hook Form     (never lifted to global — scoped to form component)
URL state     →  searchParams        (pagination, filters — shareable, back-button safe)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18.17
- npm ≥ 9 (or pnpm/yarn)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/nexadmin.git
cd nexadmin

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local if needed (defaults work out of the box)

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

**Demo credentials:**
```
admin@nexadmin.io  / password123   (Admin role)
editor@nexadmin.io / password123   (Editor role)
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint check |
| `npm run type-check` | TypeScript strict type check (no emit) |
| `npm run lint:fix` | Auto-fix lint errors |

---

## 🔑 Key Technical Decisions

### Why App Router + RSC?
Route segments are React Server Components by default — data fetching happens on the server with zero client JS shipped for static content. `"use client"` is applied only at interaction leaf components (buttons, forms, charts).

### Why TanStack Query for server state?
Provides automatic caching, background refetch, optimistic updates, and `keepPreviousData` for flicker-free pagination — all with zero boilerplate compared to manual `useEffect` fetching.

### Why URL-driven filters?
User management filters (search, role, status, page) are stored in `searchParams`. This makes filters shareable via URL, supports the browser back button, and removes the need for a separate client-state slice.

### Why Zustand over Redux/Context?
Zustand's slice pattern gives Redux-style organisation without boilerplate or Provider wrapping. The `persist` middleware handles localStorage hydration with one line of config.

### Why React Hook Form + Zod?
RHF uses uncontrolled inputs — no re-render per keystroke. Zod schemas are the single source of truth for both runtime validation and TypeScript types (`z.infer<typeof schema>`).

---

## 🔄 Replacing Mock APIs with a Real Database

Every API route in `src/app/api/` is self-contained and clearly annotated. To connect a real database:

```bash
# Install Prisma (or Drizzle ORM)
npm install prisma @prisma/client
npx prisma init
```

Then replace the in-memory arrays in each route with Prisma calls:

```ts
// Before (mock)
const users = MOCK_USERS.filter(...);

// After (Prisma)
const users = await prisma.user.findMany({
  where: { name: { contains: search, mode: 'insensitive' } },
  skip: (page - 1) * pageSize,
  take: pageSize,
});
```

---

## 🚢 Deployment (Vercel)

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fnexadmin)

### Manual deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Production deploy
vercel --prod
```

### Environment variables on Vercel

Go to **Project → Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `AUTH_SECRET` | (generate: `openssl rand -base64 32`) |

---

## 🧩 Connecting a Real Auth Provider

### Option A — Clerk (recommended for speed)

```bash
npm install @clerk/nextjs
```

Wrap `src/app/providers.tsx` with `<ClerkProvider>` and replace `useAuthStore` calls with Clerk's `useUser()` hook.

### Option B — NextAuth.js v5

```bash
npm install next-auth@beta
```

Create `src/auth.ts`, configure providers, and replace the mock `/api/auth` route.

---

## 📱 Performance Optimisations

- **Streaming** — `loading.tsx` files enable instant skeleton UIs via React Suspense
- **`keepPreviousData`** — No content flash when changing pages in the user table
- **`React.memo`** on DataTable — Prevents re-renders when parent state changes
- **URL-driven state** — Filters live in the URL, not an extra Zustand slice
- **`staleTime` tuning** — Stats: 5 min, Revenue: 10 min, Users: 30s
- **`next/image`** with `loading="lazy"` on table avatars
- **Dynamic imports** — Heavy chart components can be wrapped in `next/dynamic` if needed
- **Security headers** — X-Frame-Options, CSP, Referrer-Policy set in `next.config.ts`

---

## 🎨 UI/UX Decisions

- **Indigo + gray palette** — Professional, neutral, avoids the "Bootstrap blue" look
- **Sidebar collapse** — Persisted in Zustand, gives power users more screen real estate
- **Toast queue** — Non-blocking, auto-dismisses, stacks correctly
- **Focus-trapped modals** — WCAG 2.1 compliant, Escape closes
- **Skeleton loaders** — Match the exact layout of loaded content to eliminate layout shift
- **Hover-reveal actions** — Table row action buttons appear on hover to reduce visual noise
- **Responsive** — Mobile hamburger, collapsing search bar, responsive grid breakpoints

---

## 📂 GitHub Repository Structure

```
nexadmin/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml          # Type-check + lint on every PR
│   │   └── preview.yml     # Vercel preview deploy on PR
│   └── PULL_REQUEST_TEMPLATE.md
├── src/                    # All application code
├── public/                 # Static assets
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── ARCHITECTURE.md         # ADRs and design rationale
└── README.md
```

---

## 🛣️ 7-Day Build Plan

| Day | Focus |
|---|---|
| **1** | Project setup: Next.js + TS + Tailwind + ESLint, folder structure, types |
| **2** | Auth: login page, Zustand auth store, middleware, mock API route |
| **3** | Layout: sidebar (collapsible), header, providers, dashboard shell |
| **4** | Dashboard page: stats cards, revenue chart, traffic chart, activity feed |
| **5** | User management: DataTable, pagination, search/filters, UserFormModal |
| **6** | Settings page, notifications page, toast system, confirm dialogs |
| **7** | Polish: loading skeletons, error boundaries, a11y audit, README, deploy |

---

## 📄 License

MIT © 2024 — Built as a portfolio project demonstrating senior-level Next.js engineering.

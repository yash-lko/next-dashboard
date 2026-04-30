# NexAdmin — Architecture Decision Record

## Tech Stack Rationale

| Decision | Choice | Why |
|---|---|---|
| Framework | Next.js 14 App Router | RSC for perf, file-based routing, layouts |
| Language | TypeScript strict mode | Catch bugs at compile time, better DX |
| Styling | Tailwind CSS + CSS vars | Utility-first, consistent design tokens |
| Charts | Recharts | React-native, composable, accessible |
| Server state | TanStack Query v5 | Caching, refetch, optimistic updates |
| Client state | Zustand | Minimal boilerplate, no context hell |
| Forms | React Hook Form + Zod | Uncontrolled perf + schema validation |
| Auth | JWT (mocked) + middleware | Route protection at edge |

## Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (no layout)
│   │   └── login/page.tsx
│   ├── (dashboard)/              # Protected route group
│   │   ├── layout.tsx            # Sidebar + header shell
│   │   ├── dashboard/page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx          # List view (RSC)
│   │   │   └── [id]/page.tsx     # Detail view
│   │   ├── settings/page.tsx
│   │   └── notifications/page.tsx
│   ├── api/                      # Route handlers (mock API)
│   │   ├── auth/route.ts
│   │   └── users/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── globals.css
│   └── layout.tsx                # Root layout (providers)
│
├── components/
│   ├── ui/                       # Primitives (Button, Input, Badge...)
│   ├── layout/                   # Sidebar, Header, Nav
│   ├── dashboard/                # StatsCard, RevenueChart, ActivityFeed
│   ├── users/                    # UserTable, UserModal, UserFilters
│   └── shared/                   # DataTable, Modal, Pagination, Toast
│
├── lib/
│   ├── api/                      # API client + per-resource fetchers
│   ├── hooks/                    # useUsers, useAuth, useDebounce...
│   ├── store/                    # Zustand slices (ui, auth)
│   ├── utils/                    # cn(), formatters, date helpers
│   └── validations/              # Zod schemas
│
├── types/                        # Shared TS interfaces
│   ├── user.ts
│   ├── api.ts
│   └── auth.ts
│
└── middleware.ts                  # Auth guard at edge
```

## State Management Strategy

```
┌──────────────────────────────────────────────────────┐
│  Server State (TanStack Query)                       │
│  Users list, user detail, dashboard stats            │
│  → Caching, background refetch, optimistic mutations │
├──────────────────────────────────────────────────────┤
│  Client State (Zustand)                              │
│  Auth session, sidebar open/close, modal state,      │
│  toast queue, theme preference                       │
├──────────────────────────────────────────────────────┤
│  Form State (React Hook Form)                        │
│  Never lifted to global store — local to form        │
└──────────────────────────────────────────────────────┘
```

## API Layer

All API calls go through `src/lib/api/client.ts`:
- Base URL from env
- Auth token injection via interceptor
- Typed response with generics
- Error normalisation into `ApiError`

Individual resource modules (users.ts, auth.ts) export
typed query/mutation functions consumed by TanStack Query hooks.

## Performance Patterns

- Route segments are RSC by default; "use client" only at leaf interaction layer
- `loading.tsx` files for streaming Suspense fallbacks
- `error.tsx` files for granular error boundaries
- `next/dynamic` for heavy chart components
- `React.memo` + `useMemo` on DataTable row renders
- URL-driven pagination/search — shareable & no extra state
- Images via `next/image` with proper sizing

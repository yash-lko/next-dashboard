# NexAdmin

> Production-grade admin dashboard built with Next.js 14, TypeScript, and Tailwind CSS

A modern, fully-typed admin dashboard template featuring server-side rendering, real-time data management, and a responsive UI. Designed to be extended and customized for enterprise applications.

## ✨ Features

- **Next.js 14 App Router** — React Server Components for optimal performance and developer experience
- **Full TypeScript Support** — Strict mode enabled for compile-time safety and better IDE support
- **Responsive Design** — Mobile-first UI powered by Tailwind CSS with CSS custom properties for theming
- **Data Visualization** — Interactive charts using Recharts for analytics and reporting
- **Advanced State Management** — Server state (TanStack Query), client state (Zustand), and form validation (React Hook Form + Zod)
- **Authentication Ready** — JWT-based middleware for route protection at the edge
- **Form Handling** — Uncontrolled components with schema validation and error handling
- **Dark Mode** — Themeable UI with Tailwind CSS and CSS variables
- **Type-Safe API** — Typed API client with request/response validation
- **ESLint & TypeScript** — Pre-configured linting and type checking

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **pnpm** 8+
- **npm** or **yarn** package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yash-lko/next-dashboard.git
cd next-dashboard

# Install dependencies
npm install
# or
pnpm install
```

### Environment Setup

Copy the environment template and configure your variables:

```bash
cp .env.example .env.local
```

Configure `.env.local`:

```env
NEXT_PUBLIC_API_URL=        # API base URL (optional, uses Next.js routes by default)
NEXT_PUBLIC_APP_URL=http://localhost:3000   # App URL for auth redirects
AUTH_SECRET=your-secret-key # JWT signing secret (production only)
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

The app includes:
- **Login Page** — Protected authentication flow with JWT tokens
- **Dashboard** — Overview with analytics cards and charts
- **Users Management** — CRUD interface with data table, filtering, and pagination
- **Settings** — User preferences and configuration
- **Notifications** — Activity feed and alerts

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run type-check` | Type-check entire project without emitting |

## 📁 Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Authentication routes (login, logout)
│   ├── (dashboard)/               # Protected dashboard routes
│   │   ├── layout.tsx            # Dashboard shell (sidebar + header)
│   │   ├── dashboard/page.tsx    # Main dashboard view
│   │   ├── users/page.tsx        # Users list (RSC)
│   │   ├── users/[id]/page.tsx   # User detail view
│   │   ├── settings/page.tsx     # Settings page
│   │   └── notifications/page.tsx # Notifications feed
│   ├── api/                       # Next.js Route Handlers (mock API)
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout with providers
│
├── components/
│   ├── ui/                        # Reusable UI primitives (Button, Input, Card...)
│   ├── layout/                    # Layout components (Sidebar, Header, Navigation)
│   ├── dashboard/                 # Dashboard-specific components
│   ├── users/                     # User management components
│   └── shared/                    # Shared components (DataTable, Modal, Pagination)
│
├── lib/
│   ├── api/                       # API client and resource modules
│   ├── hooks/                     # Custom React hooks
│   ├── store/                     # Zustand state slices
│   ├── utils/                     # Utility functions (cn, formatters, etc.)
│   └── validations/               # Zod validation schemas
│
├── types/                         # TypeScript interfaces and types
│   ├── user.ts
│   ├── api.ts
│   └── auth.ts
│
├── middleware.ts                  # Authentication middleware
└── ...config files                # Next.js, Tailwind, ESLint configs
```

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 | React meta-framework with App Router and RSC |
| **Language** | TypeScript 5.4 | Type-safe development |
| **UI Framework** | Tailwind CSS 3.4 | Utility-first styling |
| **Icons** | Lucide React | Modern icon library |
| **Charts** | Recharts 2.12 | React charting library |
| **Server State** | TanStack Query 5.40 | Data fetching, caching, and synchronization |
| **Client State** | Zustand 4.5 | Lightweight state management |
| **Forms** | React Hook Form 7.51 | Performance-optimized form handling |
| **Validation** | Zod 3.23 | Schema validation and TypeScript inference |
| **Code Quality** | ESLint 8.57 | JavaScript linting |
| **Type Checking** | TypeScript Compiler | Compile-time type safety |

## 🔐 Authentication

The dashboard uses a JWT-based authentication system with edge middleware:

1. **Login** — Users authenticate via the login page with credentials
2. **Token Storage** — JWT stored in HTTP-only cookies (secure by default)
3. **Route Protection** — Middleware validates tokens at the edge before routes load
4. **Token Refresh** — Automatic token refresh on expiration
5. **Logout** — Token cleared and user redirected to login

**To customize authentication:**
- Replace mock API in `src/app/api/auth/` with your backend
- Update `src/middleware.ts` with your auth logic
- Configure environment variables for your auth provider

## 📊 State Management Strategy

### Server State (TanStack Query)

Manages data from the server: users list, pagination, filtering, and real-time updates.

```typescript
// Example: Fetch users with caching
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetchUsers(),
});
```

### Client State (Zustand)

Lightweight store for UI state: sidebar visibility, modals, theme, and auth session.

```typescript
// Example: Toggle sidebar
const { sidebarOpen, toggleSidebar } = useUIStore();
```

### Form State (React Hook Form)

Form data stays local and never lifts to global state for optimal performance.

```typescript
// Example: Form with validation
const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
```

## 🎨 Styling

The project uses **Tailwind CSS** with CSS custom properties for theming:

- Utility-first approach for rapid UI development
- Dark mode support via `dark:` prefix
- Custom color palette defined in `tailwind.config.ts`
- CSS variables for dynamic theming

### Customizing Theme

Edit `tailwind.config.ts` to modify colors, spacing, and other design tokens:

```typescript
theme: {
  colors: {
    primary: 'hsl(var(--color-primary) / <alpha-value>)',
    // Add custom colors here
  },
}
```

## 📱 API Integration

All API calls go through a centralized, typed client in `src/lib/api/client.ts`:

- **Request Interceptor** — Automatically injects JWT tokens
- **Error Handling** — Normalizes errors into `ApiError` type
- **Type Safety** — Generic response types for compile-time validation
- **Base URL** — Configurable via `NEXT_PUBLIC_API_URL` environment variable

Example usage:

```typescript
// src/lib/api/users.ts
export const fetchUsers = async (params?: QueryParams) => {
  return apiClient.get<User[]>('/users', { params });
};

// In a component
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetchUsers(),
});
```

## ⚡ Performance Optimizations

- **React Server Components** — Routes are RSC by default; only leaf components use `'use client'`
- **Streaming** — `loading.tsx` and `Suspense` boundaries for progressive rendering
- **Dynamic Imports** — Heavy components (charts) lazy-loaded with `next/dynamic`
- **Memoization** — `React.memo` and `useMemo` on frequently-rendered lists
- **URL-Driven State** — Pagination and filters in URL for shareability and bookmarking
- **Image Optimization** — All images use `next/image` with proper sizing and lazy loading

## 🧪 Development Workflow

### Code Quality

```bash
# Type-check entire project
npm run type-check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Pre-commit Checks

The project is configured with:
- **ESLint** — JavaScript/TypeScript linting
- **TypeScript** — Strict type checking
- **Prettier** — Code formatting (optional, add manually)

### Browser DevTools

- **React DevTools** — Inspect React component tree
- **Redux DevTools** — Debug Zustand state (via middleware)
- **TanStack Query DevTools** — Monitor server state and queries

## 📖 Architecture Decisions

For detailed architecture rationale, system design, and folder structure explanations, see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

Key decisions:
- **RSC over Client Components** — Better performance and smaller JS bundles
- **Zustand over Redux** — Less boilerplate, simpler learning curve
- **React Hook Form + Zod** — Type-safe forms with zero runtime overhead
- **TanStack Query** — Enterprise-grade server state management
- **Tailwind CSS** — Consistent, maintainable styling at scale

## 🚢 Deployment

### Vercel (Recommended)

Vercel is the optimal platform for Next.js:

```bash
npm i -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

Ensure these are set in your deployment platform:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
AUTH_SECRET=your-secure-random-string
```

## 📝 Best Practices

- **Always use TypeScript** — Don't disable strict mode without reason
- **Keep components small** — Single responsibility principle
- **Prefer server components** — Use `'use client'` only when necessary
- **Validate at boundaries** — Use Zod for API validation
- **Type your API responses** — Ensure type safety end-to-end
- **Use environment variables** — Never hardcode secrets or config
- **Test business logic** — Consider unit tests for hooks and utils
- **Document complex flows** — Add comments for non-obvious code

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

## 💬 Support

- **Issues** — Report bugs or request features via GitHub Issues
- **Discussions** — Ask questions in GitHub Discussions
- **Documentation** — See [ARCHITECTURE.md](./ARCHITECTURE.md) for in-depth guides

## 🙏 Acknowledgments

Built with inspiration from modern Next.js best practices and industry standards:

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Design System](https://vercel.com/design)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)

---

**Made with ❤️ by [yash-lko](https://github.com/yash-lko)**

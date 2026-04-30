'use client';

import { usePathname } from 'next/navigation';
import { useUiStore } from '@/lib/store/ui.store';
import { useAuthStore } from '@/lib/store/auth.store';

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': { title: 'Dashboard', description: 'Overview of your key metrics' },
  '/users': { title: 'User Management', description: 'Manage your team members' },
  '/settings': { title: 'Settings', description: 'Manage your account preferences' },
  '/notifications': { title: 'Notifications', description: 'Your recent activity' },
};

export function Header() {
  const pathname = usePathname();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);

  const meta = pageTitles[pathname] ?? { title: 'YashAdmin', description: '' };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6 gap-4">

      {/* Left: hamburger + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle navigation"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-semibold text-gray-900 leading-tight">{meta.title}</h1>
          {meta.description && (
            <p className="text-xs text-gray-500 hidden sm:block">{meta.description}</p>
          )}
        </div>
      </div>

      {/* Right: search + bell + avatar */}
      <div className="flex items-center gap-2">

        {/* Search */}
        <div className="relative hidden md:block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Quick search…"
            className="h-9 w-56 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            aria-label="Quick search"
          />
        </div>

        {/* Notification bell */}
        <button
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Notifications (4 unread)"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" aria-hidden />
        </button>

        {/* Built-by badge — visible to recruiters */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" aria-hidden />
          <span className="text-xs font-medium text-indigo-600">Built by Yashwant</span>
        </div>

        {/* Avatar */}
        {user && (
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user.name.split(' ')[0]}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

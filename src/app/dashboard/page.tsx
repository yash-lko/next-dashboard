// src/app/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { TrafficChart } from '@/components/dashboard/TrafficChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { formatCurrency, formatCompact } from '@/lib/utils';
import { dashboardApi } from '@/lib/api/dashboard';
import type { Metadata } from 'next';

function UsersIcon() {
  return (
    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function RevenueIcon() {
  return (
    <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function SignupIcon() {
  return (
    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}
function SessionIcon() {
  return (
    <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['dashboard', 'revenue'],
    queryFn: () => dashboardApi.getRevenueData('monthly'),
  });

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats ? formatCompact(stats.totalUsers) : '—'}
          change={4.6}
          icon={<UsersIcon />}
          iconColor="bg-indigo-50"
          isLoading={statsLoading}
        />
        <StatsCard
          title="Monthly Revenue"
          value={stats ? formatCurrency(stats.totalRevenue) : '—'}
          change={stats?.revenueGrowth ?? 0}
          icon={<RevenueIcon />}
          iconColor="bg-emerald-50"
          isLoading={statsLoading}
        />
        <StatsCard
          title="New Signups"
          value={stats ? String(stats.newSignups) : '—'}
          change={stats?.signupGrowth ?? 0}
          icon={<SignupIcon />}
          iconColor="bg-blue-50"
          isLoading={statsLoading}
        />
        <StatsCard
          title="Active Sessions"
          value={stats ? String(stats.activeSessionsToday) : '—'}
          change={stats?.sessionGrowth ?? 0}
          icon={<SessionIcon />}
          iconColor="bg-amber-50"
          isLoading={statsLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart data={revenueData ?? []} isLoading={revenueLoading} />
        </div>
        <TrafficChart />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          {/* Top users table preview */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Top Active Users</h3>
                <p className="text-xs text-gray-400 mt-0.5">By session count this week</p>
              </div>
              <a href="/users" className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                Manage users →
              </a>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Arjun Sharma', dept: 'Engineering', sessions: 48, progress: 96 },
                { name: 'Priya Patel', dept: 'Marketing', sessions: 41, progress: 82 },
                { name: 'Rahul Gupta', dept: 'Product', sessions: 37, progress: 74 },
                { name: 'Ananya Singh', dept: 'Sales', sessions: 29, progress: 58 },
                { name: 'Vikram Nair', dept: 'Design', sessions: 22, progress: 44 },
              ].map((user) => (
                <div key={user.name} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{user.sessions} sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{ width: `${user.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 w-6 text-right">{user.dept.slice(0, 3)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}

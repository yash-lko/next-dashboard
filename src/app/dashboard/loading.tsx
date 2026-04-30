// src/app/dashboard/loading.tsx
// Shown instantly via React Suspense while dashboard data loads

import { SkeletonCard } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-gray-100 bg-white h-72 animate-pulse" />
        <div className="rounded-2xl border border-gray-100 bg-white h-72 animate-pulse" />
      </div>
    </div>
  );
}

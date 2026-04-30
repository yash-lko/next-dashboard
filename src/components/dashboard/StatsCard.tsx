// src/components/dashboard/StatsCard.tsx

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  change: number; // percentage change
  changeLabel?: string;
  icon: ReactNode;
  iconColor: string;
  isLoading?: boolean;
}

export function StatsCard({ title, value, change, changeLabel, icon, iconColor, isLoading }: StatsCardProps) {
  const isPositive = change >= 0;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-24 rounded-md bg-gray-100 animate-pulse" />
          <div className="h-9 w-9 rounded-xl bg-gray-100 animate-pulse" />
        </div>
        <div className="h-8 w-32 rounded-md bg-gray-100 animate-pulse mb-2" />
        <div className="h-3 w-20 rounded-md bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', iconColor)}>
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>

      <div className="mt-1.5 flex items-center gap-1">
        <span
          className={cn(
            'inline-flex items-center text-xs font-semibold',
            isPositive ? 'text-emerald-600' : 'text-red-500'
          )}
        >
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
        <span className="text-xs text-gray-400">{changeLabel ?? 'vs last month'}</span>
      </div>
    </div>
  );
}

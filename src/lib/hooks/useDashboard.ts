// src/lib/hooks/useDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  revenue: (period: string) => [...dashboardKeys.all, 'revenue', period] as const,
  traffic: () => [...dashboardKeys.all, 'traffic'] as const,
  activity: (limit: number) => [...dashboardKeys.all, 'activity', limit] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardApi.getStats,
    staleTime: 5 * 60_000, // 5 min — stats don't change that fast
  });
}

export function useRevenueData(period: 'monthly' | 'weekly' = 'monthly') {
  return useQuery({
    queryKey: dashboardKeys.revenue(period),
    queryFn: () => dashboardApi.getRevenueData(period),
    staleTime: 10 * 60_000,
  });
}

export function useTrafficSources() {
  return useQuery({
    queryKey: dashboardKeys.traffic(),
    queryFn: dashboardApi.getTrafficSources,
    staleTime: 10 * 60_000,
  });
}

export function useActivityFeed(limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.activity(limit),
    queryFn: () => dashboardApi.getActivityFeed(limit),
    refetchInterval: 60_000, // Poll every minute for "live" feel
  });
}

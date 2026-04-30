// src/lib/api/dashboard.ts

import { apiClient } from './client';
import type { DashboardStats, RevenueDataPoint, TrafficSource, ActivityItem } from '@/types/api';

export const dashboardApi = {
  getStats: () =>
    apiClient.get<DashboardStats>('/dashboard/stats'),

  getRevenueData: (period: 'monthly' | 'weekly' = 'monthly') =>
    apiClient.get<RevenueDataPoint[]>('/dashboard/revenue', { period }),

  getTrafficSources: () =>
    apiClient.get<TrafficSource[]>('/dashboard/traffic'),

  getActivityFeed: (limit = 10) =>
    apiClient.get<ActivityItem[]>('/dashboard/activity', { limit }),
};

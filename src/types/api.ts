// src/types/api.ts

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  revenueGrowth: number; // percentage
  newSignups: number;
  signupGrowth: number;
  activeSessionsToday: number;
  sessionGrowth: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: 'user_created' | 'user_updated' | 'login' | 'settings_changed' | 'export';
  description: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

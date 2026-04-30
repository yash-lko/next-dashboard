// src/app/api/dashboard/stats/route.ts

import { NextResponse } from 'next/server';
import type { DashboardStats } from '@/types/api';

export async function GET() {
  const stats: DashboardStats = {
    totalUsers: 2847,
    activeUsers: 1923,
    totalRevenue: 148350,
    revenueGrowth: 12.4,
    newSignups: 243,
    signupGrowth: 8.1,
    activeSessionsToday: 384,
    sessionGrowth: -2.3,
  };
  return NextResponse.json({ data: stats, success: true });
}

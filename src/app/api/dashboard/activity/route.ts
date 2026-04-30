// src/app/api/dashboard/activity/route.ts

import { NextRequest, NextResponse } from 'next/server';
import type { ActivityItem } from '@/types/api';

const ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'user_created', description: 'New user Priya Patel added to Engineering', actor: 'Admin', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: '2', type: 'login', description: 'Arjun Sharma signed in from Mumbai, IN', actor: 'Arjun Sharma', timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
  { id: '3', type: 'user_updated', description: 'Role changed for Rahul Gupta → Editor', actor: 'Admin', timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  { id: '4', type: 'settings_changed', description: 'Two-factor authentication enabled', actor: 'Ananya Singh', timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
  { id: '5', type: 'export', description: 'User list exported as CSV (47 records)', actor: 'Vikram Nair', timestamp: new Date(Date.now() - 86400 * 1000).toISOString() },
];

export async function GET(req: NextRequest) {
  const limit = Number(new URL(req.url).searchParams.get('limit') ?? 10);
  return NextResponse.json({ data: ACTIVITY.slice(0, limit), success: true });
}

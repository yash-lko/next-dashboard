// src/app/api/dashboard/traffic/route.ts

import { NextResponse } from 'next/server';
import type { TrafficSource } from '@/types/api';

export async function GET() {
  const data: TrafficSource[] = [
    { name: 'Organic', value: 4200, color: '#6366f1' },
    { name: 'Direct', value: 2800, color: '#8b5cf6' },
    { name: 'Social', value: 1900, color: '#06b6d4' },
    { name: 'Referral', value: 1100, color: '#10b981' },
    { name: 'Email', value: 800, color: '#f59e0b' },
  ];
  return NextResponse.json({ data, success: true });
}

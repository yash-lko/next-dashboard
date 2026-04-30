// src/app/api/dashboard/revenue/route.ts

import { NextResponse } from 'next/server';
import type { RevenueDataPoint } from '@/types/api';

export async function GET() {
  const data: RevenueDataPoint[] = [
    { month: 'Jan', revenue: 52000, expenses: 31000 },
    { month: 'Feb', revenue: 61000, expenses: 33000 },
    { month: 'Mar', revenue: 58000, expenses: 29000 },
    { month: 'Apr', revenue: 74000, expenses: 38000 },
    { month: 'May', revenue: 81000, expenses: 41000 },
    { month: 'Jun', revenue: 96000, expenses: 44000 },
    { month: 'Jul', revenue: 89000, expenses: 42000 },
    { month: 'Aug', revenue: 103000, expenses: 47000 },
    { month: 'Sep', revenue: 118000, expenses: 51000 },
    { month: 'Oct', revenue: 132000, expenses: 55000 },
    { month: 'Nov', revenue: 141000, expenses: 58000 },
    { month: 'Dec', revenue: 148000, expenses: 62000 },
  ];
  return NextResponse.json({ data, success: true });
}

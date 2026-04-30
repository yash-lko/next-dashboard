// src/app/api/users/route.ts
// Mock API — replace with real DB calls (Prisma/Drizzle) in production

import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@/types/user';

// Simulated dataset
const MOCK_USERS: User[] = Array.from({ length: 47 }, (_, i) => ({
  id: `usr_${String(i + 1).padStart(4, '0')}`,
  name: [
    'Arjun Sharma', 'Priya Patel', 'Rahul Gupta', 'Ananya Singh', 'Vikram Nair',
    'Deepika Menon', 'Rohan Verma', 'Sneha Iyer', 'Amit Joshi', 'Kavya Reddy',
    'Siddharth Khanna', 'Meera Agarwal', 'Karan Malhotra', 'Pooja Sinha', 'Dev Kapoor',
  ][i % 15],
  email: `user${i + 1}@acme.io`,
  role: (['admin', 'editor', 'viewer'] as const)[i % 3],
  status: (['active', 'active', 'active', 'inactive', 'suspended'] as const)[i % 5],
  department: ['Engineering', 'Marketing', 'Sales', 'Design', 'Product'][i % 5],
  joinedAt: new Date(2023, i % 12, (i % 28) + 1).toISOString(),
  lastActiveAt: new Date(Date.now() - i * 3600000 * 24).toISOString(),
  avatarUrl: `https://api.dicebear.com/8.x/notionists/svg?seed=${i}`,
}));

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() ?? '';
  const role = searchParams.get('role');
  const status = searchParams.get('status');
  const page = Number(searchParams.get('page') ?? 1);
  const pageSize = Number(searchParams.get('pageSize') ?? 10);
  const sortBy = (searchParams.get('sortBy') ?? 'name') as keyof User;
  const sortOrder = searchParams.get('sortOrder') ?? 'asc';

  let filtered = MOCK_USERS.filter((u) => {
    const matchesSearch =
      !search || u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search);
    const matchesRole = !role || u.role === role;
    const matchesStatus = !status || u.status === status;
    return matchesSearch && matchesRole && matchesStatus;
  });

  filtered.sort((a, b) => {
    const av = String(a[sortBy] ?? '');
    const bv = String(b[sortBy] ?? '');
    return sortOrder === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const data = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Simulate network latency in dev
  if (process.env.NODE_ENV === 'development') {
    await new Promise((r) => setTimeout(r, 300));
  }

  return NextResponse.json({ data, total, page, pageSize, totalPages, success: true });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newUser: User = {
    id: `usr_${Date.now()}`,
    ...body,
    status: 'active',
    joinedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    avatarUrl: `https://api.dicebear.com/8.x/notionists/svg?seed=${Date.now()}`,
  };
  MOCK_USERS.unshift(newUser);
  return NextResponse.json({ data: newUser, success: true }, { status: 201 });
}

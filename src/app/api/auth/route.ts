// src/app/api/auth/route.ts
// Mock auth endpoint — replace with real DB + bcrypt in production

import { NextRequest, NextResponse } from 'next/server';
import type { LoginResponse } from '@/types/auth';

const MOCK_USERS = [
  {
    id: 'usr_0001',
    email: 'admin@nexadmin.io',
    password: 'password123', // In production: bcrypt hash
    name: 'Arjun Sharma',
    role: 'admin' as const,
    avatarUrl: 'https://api.dicebear.com/8.x/notionists/svg?seed=admin',
  },
  {
    id: 'usr_0002',
    email: 'editor@nexadmin.io',
    password: 'password123',
    name: 'Priya Patel',
    role: 'editor' as const,
    avatarUrl: 'https://api.dicebear.com/8.x/notionists/svg?seed=editor',
  },
];

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Simulate DB latency
  await new Promise((r) => setTimeout(r, 400));

  const user = MOCK_USERS.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return NextResponse.json(
      { message: 'Invalid email or password', code: 'INVALID_CREDENTIALS', success: false },
      { status: 401 }
    );
  }

  // In production: generate a real JWT signed with AUTH_SECRET
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();

  const { password: _pw, ...safeUser } = user;

  const response: LoginResponse = { user: safeUser, token, expiresAt };

  const res = NextResponse.json({ data: response, success: true });

  // Set httpOnly cookie for middleware-based protection in production
  res.cookies.set('nexadmin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 3600, // 7 days
    path: '/',
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('nexadmin_session');
  return res;
}

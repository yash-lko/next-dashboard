// src/app/api/users/[id]/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { User } from '@/types/user';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // In production, query DB: const user = await db.user.findUnique({ where: { id: params.id } })
  await new Promise((r) => setTimeout(r, 200));

  // Return a mock user for demo
  const user: User = {
    id: params.id,
    name: 'Yash',
    email: 'yas@acme.io',
    role: 'admin',
    status: 'active',
    department: 'Engineering',
    joinedAt: '2023-01-15T00:00:00.000Z',
    lastActiveAt: new Date().toISOString(),
    avatarUrl: `https://api.dicebear.com/8.x/notionists/svg?seed=${params.id}`,
  };

  return NextResponse.json({ data: user, success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  await new Promise((r) => setTimeout(r, 300));

  // In production: const updated = await db.user.update({ where: { id: params.id }, data: body })
  const updated: Partial<User> = { id: params.id, ...body };

  return NextResponse.json({ data: updated, success: true });
}

export async function DELETE(_req: NextRequest) {
  await new Promise((r) => setTimeout(r, 200));
  // In production: await db.user.delete({ where: { id: 'userId' } })
  return NextResponse.json({ success: true }, { status: 204 });
}

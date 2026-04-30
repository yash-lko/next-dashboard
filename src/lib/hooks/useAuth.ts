// src/lib/hooks/useAuth.ts
'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { useUiStore } from '@/lib/store/ui.store';
import type { LoginCredentials } from '@/types/auth';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, logout: storeLogout } = useAuthStore();
  const addToast = useUiStore((s) => s.addToast);

  async function login(credentials: LoginCredentials) {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message ?? 'Login failed');
      }

      const { user, token } = json.data;
      setUser(user, token);
      addToast({ type: 'success', title: `Welcome back, ${user.name.split(' ')[0]}!` });
      router.replace('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      addToast({ type: 'error', title: 'Sign in failed', description: message });
      throw err;
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } catch {
      // Best-effort — clear client state regardless
    }
    storeLogout();
    addToast({ type: 'info', title: 'Signed out successfully' });
    router.replace('/login');
  }

  return { user, isAuthenticated, isLoading, login, logout };
}

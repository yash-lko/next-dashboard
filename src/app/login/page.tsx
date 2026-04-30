// src/app/login/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/lib/store/auth.store';
import { useUiStore } from '@/lib/store/ui.store';
import { loginSchema, type LoginInput } from '@/lib/validations/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Mock auth — swap for real API call in production
async function mockLogin(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 800));
  if (email === 'admin@yash.io' && password === 'yash@123') {
    return {
      user: { id: 'usr_0001', name: 'Arjun Sharma', email, role: 'admin' as const },
      token: 'mock_jwt_token_' + Date.now(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
  }
  throw new Error('Invalid credentials. Try admin@yash.io / yash@123');
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser, isAuthenticated } = useAuthStore();
  const addToast = useUiStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginInput) => {
    try {
      const { user, token } = await mockLogin(data.email, data.password);
      setUser(user, token);
      addToast({ type: 'success', title: `Welcome back, ${user.name.split(' ')[0]}!` });
      router.push('/dashboard');
    } catch (err) {
      setError('root', { message: (err as Error).message });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">NexAdmin</span>
        </div>

        <div>
          <blockquote className="text-2xl font-semibold text-white leading-relaxed">
            "The dashboard our team actually{' '}
            <span className="text-indigo-400">wants to use</span>{' '}
            every day."
          </blockquote>
          <p className="mt-4 text-gray-400 text-sm">— Priya Patel, Head of Product at Acme Corp</p>
        </div>

        <div className="flex items-center gap-6">
          {['2,847 users', '99.9% uptime', 'SOC 2 Type II'].map((stat) => (
            <div key={stat} className="text-xs text-gray-500 border border-gray-800 rounded-full px-3 py-1">
              {stat}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">NexAdmin</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back. Enter your credentials to continue.
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
            <p className="text-xs font-semibold text-indigo-700 mb-1">Demo credentials</p>
            <p className="text-xs text-indigo-600 font-mono">admin@yash.io / yash@123</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              required
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
              {...register('password')}
            />

            {errors.root && (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <a href="#" className="underline underline-offset-2 hover:text-gray-600">Terms</a>{' '}
            and{' '}
            <a href="#" className="underline underline-offset-2 hover:text-gray-600">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

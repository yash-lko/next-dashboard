// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 text-center p-4">
      <div className="text-8xl font-black text-gray-100 select-none">404</div>
      <div className="-mt-4">
        <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-1 text-sm text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="mt-2 inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

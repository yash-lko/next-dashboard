import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/shared/Toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'YashAdmin', template: '%s | YashAdmin' },
  description:
    'Production-grade admin dashboard built by Yashwant — Next.js 14, TypeScript, Tailwind CSS, TanStack Query, Zustand.',
  keywords: ['admin dashboard', 'nextjs', 'typescript', 'yashwant', 'portfolio'],
  authors: [{ name: 'Yashwant' }],
  creator: 'Yashwant',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

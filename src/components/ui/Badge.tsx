// src/components/ui/Badge.tsx

import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger: 'bg-red-50 text-red-700 border-red-100',
  info: 'bg-blue-50 text-blue-700 border-blue-100',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-indigo-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-gray-400',
};

export function Badge({ variant = 'default', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', dotColors[variant])}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

// Helper to map domain values to badge variants
export function statusToBadge(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    active: 'success',
    inactive: 'neutral',
    suspended: 'danger',
    admin: 'default',
    editor: 'info',
    viewer: 'neutral',
  };
  return map[status] ?? 'neutral';
}

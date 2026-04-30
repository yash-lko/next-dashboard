// src/components/ui/Avatar.tsx
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

const colors = [
  'bg-indigo-500',
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-pink-500',
];

function getColor(name: string): string {
  const index = name.charCodeAt(0) % colors.length;
  return colors[index] ?? 'bg-indigo-500';
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizeClass = sizes[size];
  const colorClass = getColor(name);

  if (src) {
    return (
      <div className={cn('relative rounded-full overflow-hidden flex-shrink-0', sizeClass, className)}>
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          sizes="64px"
          unoptimized // dicebear SVGs don't need optimization
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white',
        sizeClass,
        colorClass,
        className
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}

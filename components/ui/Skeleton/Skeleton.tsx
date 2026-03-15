import { cn } from '@/lib/classes';
import type { SkeletonProps, SkeletonListProps } from './ISkeleton';

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={cn('animate-pulse rounded-default bg-border', className)} />
  );
}

export function SkeletonList({ lines = 3 }: SkeletonListProps) {
  return (
    <div className="flex flex-col gap-sm" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-sm rounded-default border border-border bg-surface px-md py-sm"
        >
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="flex flex-1 flex-col gap-xs">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

import { cn } from '@/lib/classes';
import type { SkeletonProps, SkeletonListProps } from './ISkeleton';

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={cn('animate-pulse rounded-default bg-border', className)} />
  );
}

export function SkeletonList({ lines = 3, showActions = true }: SkeletonListProps) {
  return (
    <div className="flex flex-col gap-sm" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-xs rounded-default border border-border bg-surface px-md py-sm shadow-card"
        >
          {/* Row 1: badge + icons */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20 rounded-default" />

            {showActions && (
              <div className="flex gap-xs">
                <Skeleton className="h-5 w-5 rounded-default" />
                <Skeleton className="h-5 w-5 rounded-default" />
              </div>
            )}
          </div>
          {/* Row 2: description */}
          <Skeleton className="h-4 w-3/4" />
          {/* Row 3: date + amount */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

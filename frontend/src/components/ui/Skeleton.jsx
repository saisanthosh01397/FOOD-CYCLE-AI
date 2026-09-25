import React from 'react';
import { cn } from './Button';

/**
 * Skeleton loader component.
 * Usage: <Skeleton className="h-8 w-32" /> for inline
 *        <SkeletonCard /> for full card placeholder
 */
export function Skeleton({ className }) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-slate-200 dark:bg-slate-800/80 rounded-lg",
      "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:animate-[shimmer_1.6s_infinite]",
      className
    )} />
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn("bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-3", className)}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-20 opacity-60" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" style={{ opacity: 1 - j * 0.15 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ className }) {
  return (
    <div className={cn("flex items-end gap-2 px-6 pb-6 pt-2", className)}>
      {[40, 65, 45, 80, 55, 70, 60, 85, 50, 75, 45, 90].map((h, i) => (
        <Skeleton key={i} className="flex-1 rounded-sm" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

export default Skeleton;

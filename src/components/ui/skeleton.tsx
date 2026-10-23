import { cn } from "@/lib/utils";

/**
 * Skeleton component with subtle quartz shimmer & sonic pulse effect.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/15 dark:bg-white/[0.06] animate-pulse",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/10 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton preset/effect card loading placeholder.
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "surface-card glass-panel rounded-2xl p-5 border border-line space-y-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-1.5 pt-1">
        <Skeleton className="h-4.5 w-3/4 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-5/6 rounded" />
      </div>
      <div className="pt-3 border-t border-line/60 flex items-center justify-between">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Skeleton waveform visualizer placeholder.
 */
export function SkeletonWaveform({ className }: { className?: string }) {
  const bars = [32, 55, 80, 45, 90, 70, 40, 65, 85, 30, 60, 95, 50, 75, 40, 60, 85, 70, 45, 30];
  return (
    <div
      className={cn(
        "surface-card rounded-2xl border border-line p-5 space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-44 rounded" />
            <Skeleton className="h-3 w-28 rounded" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      <div className="h-24 w-full flex items-center justify-between gap-1.5 px-2">
        {bars.map((height, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-full"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-3 w-12 rounded" />
        <Skeleton className="h-3 w-12 rounded" />
      </div>
    </div>
  );
}

/**
 * Multi-card skeleton grid for presets and blog routes.
 */
export function SkeletonGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

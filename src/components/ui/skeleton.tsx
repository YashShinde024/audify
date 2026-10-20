import { cn } from "@/lib/utils";

/**
 * Skeleton component with subtle wire shimmer & pulse effect.
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

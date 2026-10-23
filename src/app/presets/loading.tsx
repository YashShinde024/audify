import { Skeleton, SkeletonGrid } from "@/components/ui/skeleton";

export default function PresetsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-9 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 max-w-full rounded" />
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      <SkeletonGrid count={9} />
    </div>
  );
}

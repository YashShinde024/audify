import { Skeleton, SkeletonGrid } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-lg rounded" />
      </div>

      <div className="surface-card rounded-2xl p-6 border border-line space-y-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-7 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded" />
      </div>

      <SkeletonGrid count={6} />
    </div>
  );
}

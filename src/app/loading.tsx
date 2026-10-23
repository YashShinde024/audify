import { Skeleton, SkeletonGrid, SkeletonWaveform } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-10 w-3/4 max-w-md rounded-xl" />
        <Skeleton className="h-4 w-full max-w-xl rounded" />
      </div>

      <SkeletonWaveform />

      <SkeletonGrid count={6} />
    </div>
  );
}

import { Skeleton, SkeletonWaveform } from "@/components/ui/skeleton";

export default function StudioLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      <SkeletonWaveform />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 surface-card rounded-2xl p-6 border border-line space-y-4">
          <Skeleton className="h-6 w-36 rounded" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-12 rounded" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card rounded-2xl p-6 border border-line space-y-4">
          <Skeleton className="h-6 w-32 rounded" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

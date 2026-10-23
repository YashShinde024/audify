import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-200">
      <div className="text-center space-y-4">
        <Skeleton className="h-6 w-48 mx-auto rounded-full" />
        <Skeleton className="h-14 w-64 mx-auto rounded-xl" />
        <Skeleton className="h-10 w-3/4 max-w-lg mx-auto rounded-xl" />
        <Skeleton className="h-4 w-full max-w-md mx-auto rounded" />
      </div>

      <div className="surface-card rounded-3xl p-8 border border-line space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-6 w-48 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <div className="grid gap-4 sm:grid-cols-2 pt-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    </div>
  );
}

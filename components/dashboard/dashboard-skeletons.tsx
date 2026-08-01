import { Skeleton } from "@/components/ui/skeleton";

/**
 * All dashboard loading.tsx files reuse pieces from here.
 * Keep the sizes aligned with the real components so nothing shifts when data loads.
 */

export function PageHeaderSkeleton({ withAction = false }: { withAction?: boolean }) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2.5">
        <Skeleton className="h-2 w-16" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-3 w-64" />
      </div>

      {withAction && <Skeleton className="h-9 w-32" />}
    </div>
  );
}

export function StatGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <Skeleton className="h-2 w-20" />
            <Skeleton className="size-4" />
          </div>

          <Skeleton className="mt-4 h-7 w-16" />
          <Skeleton className="mt-2 h-2 w-24" />
        </div>
      ))}
    </div>
  );
}

/** Card row used for rental requests / properties */
export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 border border-border bg-card p-4 sm:flex-row"
        >
          <Skeleton className="aspect-[4/3] w-full shrink-0 sm:size-20" />

          <div className="flex-1 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-3.5 w-48" />
              <Skeleton className="h-4 w-16" />
            </div>

            <Skeleton className="h-2.5 w-32" />

            <div className="flex gap-4 pt-2">
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 sm:flex-col sm:items-end">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-7 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 8,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="border border-border">
      {/* header */}
      <div
        className="flex gap-4 border-b border-border p-3"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-2.5 flex-1" />
        ))}
      </div>

      {/* rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 border-b border-border p-3.5 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Row of filter chips */
export function FilterRowSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-6 w-20" />
      ))}
    </div>
  );
}

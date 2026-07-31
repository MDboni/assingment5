import { PageHeaderSkeleton } from "@/components/dashboard/dashboard-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPropertiesLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-full sm:max-w-xs" />
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-20" />
          ))}
        </div>
      </div>

      <div className="border border-border">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border p-3.5 last:border-b-0"
          >
            <Skeleton className="size-12 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-2 w-40" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

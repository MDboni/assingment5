import { PageHeaderSkeleton } from "@/components/dashboard/dashboard-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCategoriesLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton withAction />

      <div className="border border-border">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border p-3.5 last:border-b-0"
          >
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2 w-52" />
            </div>
            <div className="flex gap-1.5">
              <Skeleton className="h-7 w-14" />
              <Skeleton className="size-7" />
              <Skeleton className="size-7" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

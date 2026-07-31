import {
  PageHeaderSkeleton,
  StatGridSkeleton,
} from "@/components/dashboard/dashboard-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton withAction />
      <StatGridSkeleton />

      <section className="grid gap-px border border-border bg-border sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-background p-5">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="mt-3 h-7 w-12" />
            <Skeleton className="mt-2 h-2 w-20" />
          </div>
        ))}
      </section>

      <section>
        <Skeleton className="mb-4 h-2.5 w-40" />
        <div className="border border-border">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 border-b border-border p-3.5 last:border-b-0"
            >
              <div className="space-y-2">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-2 w-32" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

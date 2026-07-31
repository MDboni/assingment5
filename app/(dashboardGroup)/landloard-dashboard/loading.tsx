import {
  CardListSkeleton,
  PageHeaderSkeleton,
  StatGridSkeleton,
} from "@/components/dashboard/dashboard-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function LandlordDashboardLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton withAction />
      <StatGridSkeleton />

      <section>
        <Skeleton className="mb-4 h-2.5 w-32" />
        <CardListSkeleton count={4} />
      </section>
    </div>
  );
}

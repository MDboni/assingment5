import {
  CardListSkeleton,
  FilterRowSkeleton,
  PageHeaderSkeleton,
} from "@/components/dashboard/dashboard-skeletons";

export default function TenantRequestsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <FilterRowSkeleton count={7} />
      <CardListSkeleton count={4} />
    </div>
  );
}

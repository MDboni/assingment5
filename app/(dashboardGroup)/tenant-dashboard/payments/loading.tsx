import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/dashboard/dashboard-skeletons";

export default function TenantPaymentsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <TableSkeleton rows={6} columns={5} />
    </div>
  );
}

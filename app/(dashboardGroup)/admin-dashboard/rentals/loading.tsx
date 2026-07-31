import {
  FilterRowSkeleton,
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/dashboard/dashboard-skeletons";

export default function AdminRentalsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <FilterRowSkeleton count={7} />
      <TableSkeleton rows={10} columns={5} />
    </div>
  );
}

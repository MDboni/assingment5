import {
  CardListSkeleton,
  FilterRowSkeleton,
  PageHeaderSkeleton,
} from "@/components/dashboard/dashboard-skeletons";

export default function LandlordPropertiesLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton withAction />
      <FilterRowSkeleton />
      <CardListSkeleton count={5} />
    </div>
  );
}

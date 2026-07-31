import { PropertyGridSkeleton } from "@/components/property/property-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      {/* শিরোনাম */}
      <div className="space-y-3 border-b border-border pb-8">
        <Skeleton className="h-2 w-16" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3 w-96 max-w-full" />
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* sidebar filter */}
        <aside className="hidden space-y-7 lg:block">
          <Skeleton className="h-3 w-20" />

          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2.5">
              <Skeleton className="h-2 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </aside>

        <div>
          <Skeleton className="mb-5 h-3 w-40 lg:hidden" />
          <PropertyGridSkeleton count={9} />
        </div>
      </div>
    </div>
  );
}

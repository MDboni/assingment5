import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
      <Skeleton className="h-3 w-52" />

      <div className="mt-6 lg:grid lg:grid-cols-[1.6fr_1fr] lg:gap-10">
        <div>
          <Skeleton className="aspect-[16/10] w-full" />

          <div className="mt-3 grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[4/3]" />
            ))}
          </div>

          <div className="mt-8 space-y-3 border-b border-border pb-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-background p-4">
                <Skeleton className="size-4" />
                <Skeleton className="mt-2.5 h-4 w-12" />
                <Skeleton className="mt-1.5 h-2 w-14" />
              </div>
            ))}
          </div>
        </div>

        <aside className="mt-10 lg:mt-0">
          <Skeleton className="h-72 w-full" />
        </aside>
      </div>
    </div>
  );
}

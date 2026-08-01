import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 lg:px-8">
      {/* Title */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 shrink-0" />

          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        <Skeleton className="h-9 w-36" />
      </div>

      {/* Two form cards */}
      {[4, 3].map((fieldCount, cardIndex) => (
        <section
          key={cardIndex}
          className="mt-6 space-y-4 border border-border bg-card p-6"
        >
          <Skeleton className="h-2 w-28" />
          <Skeleton className="h-3 w-64 max-w-full" />

          <div className="space-y-4 pt-2">
            {Array.from({ length: fieldCount }).map((_, index) => (
              <div key={index} className="space-y-1.5">
                <Skeleton className="h-2 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Skeleton className="h-9 w-32" />
          </div>
        </section>
      ))}
    </div>
  );
}

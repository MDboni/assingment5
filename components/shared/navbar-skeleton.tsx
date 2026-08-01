import { Skeleton } from "@/components/ui/skeleton";

/** What shows in the navbar's right corner before getMe resolves. */
export function NavAuthSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="hidden h-8 w-16 sm:block" />
      <Skeleton className="size-8 rounded-full" />
    </div>
  );
}

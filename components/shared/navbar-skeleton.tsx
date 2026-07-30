import { Skeleton } from "@/components/ui/skeleton";

/** getMe resolve হওয়ার আগে navbar-এর ডান কোণায় যা দেখাবে */
export function NavAuthSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="hidden h-8 w-16 sm:block" />
      <Skeleton className="size-8 rounded-full" />
    </div>
  );
}

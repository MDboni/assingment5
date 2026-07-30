import { HouseLineIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Brand({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <span className="grid size-7 place-items-center border border-primary/30 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <HouseLineIcon weight="bold" className="size-4" />
      </span>

      <span className="text-sm font-semibold tracking-tight">
        Rent<span className="text-primary">Nest</span>
      </span>
    </Link>
  );
}

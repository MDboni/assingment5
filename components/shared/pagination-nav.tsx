import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * যেকোনো তালিকায় বসানো যায় — শুধু basePath আর searchParams দাও।
 * বর্তমান সব filter ধরে রেখে শুধু page বদলায়।
 */
export function PaginationNav({
  basePath,
  page,
  totalPages,
  searchParams,
}: {
  basePath: string;
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && typeof value === "string" && value) {
        params.set(key, value);
      }
    });

    params.set("page", String(target));

    return `${basePath}?${params.toString()}`;
  };

  // অনেক পাতা হলে সব দেখানো যাবে না — বর্তমানটার আশেপাশে ৫টা
  const windowStart = Math.max(1, Math.min(page - 2, totalPages - 4));
  const windowEnd = Math.min(totalPages, windowStart + 4);

  const pages = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, index) => windowStart + index
  );

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-1.5"
    >
      <PageLink href={hrefFor(page - 1)} disabled={page <= 1} label="Previous page">
        <CaretLeftIcon className="size-3.5" />
      </PageLink>

      {windowStart > 1 && (
        <span className="px-1 text-[10px] text-muted-foreground">…</span>
      )}

      {pages.map((item) => (
        <PageLink
          key={item}
          href={hrefFor(item)}
          active={item === page}
          label={`Page ${item}`}
        >
          {item}
        </PageLink>
      ))}

      {windowEnd < totalPages && (
        <span className="px-1 text-[10px] text-muted-foreground">…</span>
      )}

      <PageLink
        href={hrefFor(page + 1)}
        disabled={page >= totalPages}
        label="Next page"
      >
        <CaretRightIcon className="size-3.5" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  children,
  active,
  disabled,
  label,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  label: string;
}) {
  const className = cn(
    "grid size-8 place-items-center border text-[11px] transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
    disabled && "pointer-events-none opacity-40"
  );

  if (disabled) {
    return (
      <span aria-disabled className={className}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}

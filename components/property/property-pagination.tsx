import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function PropertyPagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (totalPages <= 1) return null;

  /** বর্তমান সব filter ধরে রেখে শুধু page বদলাই */
  const hrefFor = (target: number) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && typeof value === "string" && value) {
        params.set(key, value);
      }
    });

    params.set("page", String(target));

    return `/properties?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-1.5"
    >
      <PageLink
        href={hrefFor(page - 1)}
        disabled={page <= 1}
        label="Previous page"
      >
        <CaretLeftIcon className="size-3.5" />
      </PageLink>

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
    <Link href={href} aria-label={label} aria-current={active ? "page" : undefined} className={className}>
      {children}
    </Link>
  );
}

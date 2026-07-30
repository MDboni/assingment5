import Link from "next/link";

import { cn } from "@/lib/utils";

export function StatusFilter({
  basePath,
  current,
  options,
}: {
  basePath: string;
  current?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <FilterLink href={basePath} active={!current}>
        All
      </FilterLink>

      {options.map((option) => (
        <FilterLink
          key={option.value}
          href={`${basePath}?status=${option.value}`}
          active={current === option.value}
        >
          {option.label}
        </FilterLink>
      ))}
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

"use client";

import { XIcon } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { AMENITIES, BEDROOM_OPTIONS, CITIES } from "@/lib/constants";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PropertyFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  /** Build a new URL while treating the URL as the single source of truth. */
  const buildUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    // When filters change, return to page 1,
    // otherwise page 5 might show "nothing found".
    params.delete("page");

    return `${pathname}?${params.toString()}`;
  };

  const apply = (updates: Record<string, string | null>) => {
    startTransition(() => {
      router.push(buildUrl(updates), { scroll: false });
    });
  };

  /** Clicking the currently selected value toggles it off. */
  const toggle = (key: string, value: string) =>
    apply({ [key]: searchParams.get(key) === value ? null : value });

  const isOn = (key: string, value: string) => searchParams.get(key) === value;

  // ── Search and price: update after a short pause, not on every keystroke ──
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  // Keep the inputs in sync with the URL when navigating back and forward.
  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setMinPrice(searchParams.get("minPrice") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const current = {
      search: searchParams.get("search") ?? "",
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
    };

    // Nothing changed -> don't navigate unnecessarily.
    if (
      search === current.search &&
      minPrice === current.minPrice &&
      maxPrice === current.maxPrice
    ) {
      return;
    }

    const timer = setTimeout(() => {
      apply({
        search: search || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
      });
    }, 450);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, minPrice, maxPrice]);

  const activeCount = [
    "search",
    "city",
    "categorySlug",
    "bedrooms",
    "amenity",
    "minPrice",
    "maxPrice",
  ].filter((key) => searchParams.get(key)).length;

  return (
    <div
      className={cn(
        "space-y-7 transition-opacity",
        isPending && "pointer-events-none opacity-60"
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Filters {activeCount > 0 && `(${activeCount})`}
        </p>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => startTransition(() => router.push(pathname))}
            className="inline-flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-destructive"
          >
            <XIcon className="size-3" />
            Clear all
          </button>
        )}
      </div>

      {/* ── Keyword ── */}
      <FilterGroup label="Keyword">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Area, title, address…"
          className="h-9 w-full border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
        />
      </FilterGroup>

      {/* ── City ── */}
      <FilterGroup label="City">
        <div className="flex flex-wrap gap-1.5">
          {CITIES.map((city) => (
            <Chip
              key={city}
              active={isOn("city", city)}
              onClick={() => toggle("city", city)}
            >
              {city}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      {/* ── Category ── */}
      {categories.length > 0 && (
        <FilterGroup label="Property type">
          <div className="space-y-1">
            {categories.map((category) => {
              const active = isOn("categorySlug", category.slug);

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggle("categorySlug", category.slug)}
                  className={cn(
                    "flex w-full items-center justify-between border-l-2 px-2.5 py-1.5 text-[11px] transition-colors",
                    active
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {category.name}
                  <span className="text-[9px] opacity-60">
                    {category.propertyCount ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}

      {/* ── Price ── */}
      <FilterGroup label="Monthly rent (৳)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="Min"
            className="h-9 w-full border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
          />

          <span className="text-muted-foreground">—</span>

          <input
            type="number"
            inputMode="numeric"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Max"
            className="h-9 w-full border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
          />
        </div>
      </FilterGroup>

      {/* ── Bedrooms ── */}
      <FilterGroup label="Bedrooms (minimum)">
        <div className="flex flex-wrap gap-1.5">
          {BEDROOM_OPTIONS.map((count) => (
            <Chip
              key={count}
              active={isOn("bedrooms", count)}
              onClick={() => toggle("bedrooms", count)}
            >
              {count}+
            </Chip>
          ))}
        </div>
      </FilterGroup>

      {/* ── Amenity ── */}
      <FilterGroup label="Amenity">
        <div className="flex flex-wrap gap-1.5">
          {AMENITIES.map((amenity) => (
            <Chip
              key={amenity}
              active={isOn("amenity", amenity)}
              onClick={() => toggle("amenity", amenity)}
            >
              {amenity}
            </Chip>
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

/* ── Two small helpers ── */

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border px-2.5 py-1 text-[10px] capitalize transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

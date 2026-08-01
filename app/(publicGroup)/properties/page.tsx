import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { Suspense } from "react";

import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyGridSkeleton } from "@/components/property/property-card-skeleton";
import { PropertyResults } from "@/components/property/property-results";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { PropertyQuery } from "@/service/property";
import { getCategories } from "@/service/category";

export const metadata: Metadata = {
  title: "Browse rentals",
  description:
    "Search verified rental properties by city, budget, bedrooms and amenities.",
};

type SearchParams = Record<string, string | string[] | undefined>;

/** Build the backend query from URL strings. */
const toQuery = (params: SearchParams): PropertyQuery => {
  const pick = (key: string) => {
    const value = params[key];
    return typeof value === "string" && value ? value : undefined;
  };

  const [sortBy, sortOrder] = (pick("sort") ?? "createdAt:desc").split(":");

  return {
    search: pick("search"),
    city: pick("city"),
    categorySlug: pick("categorySlug"),
    bedrooms: pick("bedrooms"),
    minPrice: pick("minPrice"),
    maxPrice: pick("maxPrice"),
    amenity: pick("amenity"),
    page: pick("page"),
    sortBy: sortBy as PropertyQuery["sortBy"],
    sortOrder: sortOrder === "asc" ? "asc" : "desc",
  };
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // In Next 16, searchParams is a Promise, so we have to await it.
  const params = await searchParams;

  const categories = await getCategories();
  const query = toQuery(params);

  // When filters change, give Suspense a new key so it shows the skeleton again.
  const resultsKey = JSON.stringify(params);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      {/* ── Title ── */}
      <div className="border-b border-border pb-8">
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary">
          Browse
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Rental properties
        </h1>

        <p className="mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground">
          Filter by city, budget, bedrooms and amenities to find a place that
          fits.
        </p>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <PropertyFilters categories={categories} />
          </div>
        </aside>

        <div>
          {/* ── Mobile: filter drawer ── */}
          <div className="mb-5 lg:hidden">
            <Sheet>
              <SheetTrigger
                render={<Button variant="outline" size="lg" className="w-full" />}
              >
                <SlidersHorizontalIcon className="size-4" />
                Filters & sort
              </SheetTrigger>

              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader className="border-b border-border px-5 py-4">
                  <SheetTitle className="text-sm">Filters</SheetTitle>
                </SheetHeader>

                <div className="p-5">
                  <PropertyFilters categories={categories} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Suspense key={resultsKey} fallback={<PropertyGridSkeleton count={9} />}>
            <PropertyResults query={query} searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

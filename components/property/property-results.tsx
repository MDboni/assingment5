import { MagnifyingGlassIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { PropertyCard } from "@/components/property/property-card";
import { PropertyPagination } from "@/components/property/property-pagination";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE } from "@/lib/constants";
import { getProperties, type PropertyQuery } from "@/service/property";

export async function PropertyResults({
  query,
  searchParams,
}: {
  query: PropertyQuery;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { properties, meta, error } = await getProperties({
    ...query,
    limit: String(PAGE_SIZE),
  });

  if (error) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-12 text-center">
        <WarningCircleIcon className="mx-auto size-6 text-destructive" />
        <p className="mt-3 text-xs font-medium">Couldn&apos;t load properties</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="border border-dashed border-border p-12 text-center">
        <MagnifyingGlassIcon className="mx-auto size-6 text-muted-foreground" />

        <p className="mt-3 text-xs font-medium">No properties match your filters</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Try widening your price range or clearing a filter.
        </p>

        <Button
          variant="outline"
          size="sm"
          className="mt-5"
          render={<Link href="/properties" />}
        >
          Clear all filters
        </Button>
      </div>
    );
  }

  const page = Number(query.page ?? 1);
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

  return (
    <>
      <p className="mb-5 text-[11px] text-muted-foreground">
        Showing{" "}
        <span className="text-foreground">{properties.length}</span> of{" "}
        <span className="text-foreground">{meta?.total ?? 0}</span> properties
      </p>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {properties.map((property, index) => (
          <PropertyCard
            key={property.id}
            property={property}
            priority={index < 3}
          />
        ))}
      </div>

      <PropertyPagination
        page={page}
        totalPages={totalPages}
        searchParams={searchParams}
      />
    </>
  );
}

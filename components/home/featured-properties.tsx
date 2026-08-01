import { WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";

import { PropertyCard } from "@/components/property/property-card";
import { getProperties } from "@/service/property";

export async function FeaturedProperties() {
  const { properties, error } = await getProperties({
    limit: "6",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // ── Backend unreachable ──
  if (error) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-10 text-center">
        <WarningCircleIcon className="mx-auto size-6 text-destructive" />

        <p className="mt-3 text-xs font-medium">Couldn&apos;t load properties</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{error}</p>
      </div>
    );
  }

  // ── Everything is fine, but there is nothing to show ──
  if (!properties.length) {
    return (
      <div className="border border-dashed border-border p-10 text-center">
        <p className="text-xs font-medium">No properties listed yet</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Check back soon — new rentals are added every day.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property, index) => (
        <PropertyCard
          key={property.id}
          property={property}
          // Load the first three images first
          priority={index < 3}
        />
      ))}
    </div>
  );
}

import {
  BathtubIcon,
  BedIcon,
  MapPinIcon,
  RulerIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import { formatCurrency } from "@/lib/format";
import type { Property } from "@/lib/types";

export function PropertyCard({
  property,
  priority = false,
}: {
  property: Property;
  priority?: boolean;
}) {
  const cover = property.images?.[0];

  const specs = [
    { icon: BedIcon, value: `${property.bedrooms} bed` },
    { icon: BathtubIcon, value: `${property.bathrooms} bath` },
    { icon: RulerIcon, value: `${property.sizeSqft} sqft` },
  ];

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-[0_8px_30px_-12px_var(--primary)]"
    >
      {/* ── ছবি ── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            No image
          </div>
        )}

        {property.category && (
          <span className="absolute left-3 top-3 border border-border/50 bg-background/90 px-2 py-1 text-[9px] uppercase tracking-[0.15em] backdrop-blur-sm">
            {property.category.name}
          </span>
        )}

        {property.reviewCount ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 border border-border/50 bg-background/90 px-2 py-1 text-[9px] backdrop-blur-sm">
            <StarIcon weight="fill" className="size-2.5 text-primary" />
            {property.reviewCount}
          </span>
        ) : null}
      </div>

      {/* ── তথ্য ── */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-sm font-medium transition-colors group-hover:text-primary">
          {property.title}
        </h3>

        <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPinIcon className="size-3 shrink-0" />
          <span className="line-clamp-1">
            {property.area}, {property.city}
          </span>
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {specs.map((spec) => (
            <span
              key={spec.value}
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"
            >
              <spec.icon className="size-3" />
              {spec.value}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="text-sm font-semibold text-primary">
              {formatCurrency(property.monthlyRent)}
            </p>
            <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
              per month
            </p>
          </div>

          <span className="text-[10px] text-muted-foreground transition-colors group-hover:text-primary">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}

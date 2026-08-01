import {
  BedIcon,
  MapPinIcon,
  PencilSimpleIcon,
  TrayIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import { DeletePropertyButton } from "@/components/landlord/delete-property-button";
import { PropertyStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { LandlordProperty } from "@/lib/types";

export function PropertyRow({ property }: { property: LandlordProperty }) {
  const cover = property.images?.[0];

  return (
    <article className="flex flex-col gap-4 border border-border bg-card p-4 sm:flex-row sm:items-center">
      {/* ── Thumbnail ── */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted sm:size-20">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* ── Details ── */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/properties/${property.id}`}
            className="line-clamp-1 text-xs font-medium transition-colors hover:text-primary"
          >
            {property.title}
          </Link>

          <PropertyStatusBadge status={property.status} />

          {property.pendingRequestCount > 0 && (
            <span className="inline-flex items-center gap-1 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-600 dark:text-amber-400">
              <TrayIcon className="size-2.5" />
              {property.pendingRequestCount} new
            </span>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPinIcon className="size-3" />
            {property.area}, {property.city}
          </span>

          <span className="inline-flex items-center gap-1">
            <BedIcon className="size-3" />
            {property.bedrooms} bed · {property.bathrooms} bath
          </span>

          {property.category && <span>{property.category.name}</span>}
        </div>
      </div>

      {/* ── Price + actions ── */}
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="text-right">
          <p className="text-sm font-semibold text-primary">
            {formatCurrency(property.monthlyRent)}
          </p>
          <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
            per month
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${property.title}`}
            render={
              <Link
                href={`/landloard-dashboard/properties/${property.id}/edit`}
              />
            }
          >
            <PencilSimpleIcon className="size-3.5" />
          </Button>

          <DeletePropertyButton
            propertyId={property.id}
            propertyTitle={property.title}
          />
        </div>
      </div>
    </article>
  );
}

import { HouseLineIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { SearchBox } from "@/components/dashboard/search-box";
import { StatusFilter } from "@/components/dashboard/status-filter";
import { PaginationNav } from "@/components/shared/pagination-nav";
import { PropertyStatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/format";
import { getAllProperties } from "@/service/admin";

export const metadata: Metadata = { title: "All properties" };

const PAGE_SIZE = 12;

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "RENTED", label: "Rented" },
  { value: "UNAVAILABLE", label: "Hidden" },
  { value: "ARCHIVED", label: "Archived" },
];

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const pick = (key: string) =>
    typeof params[key] === "string" && params[key] ? params[key] : undefined;

  const { data: properties, meta, error } = await getAllProperties({
    search: pick("search"),
    status: pick("status"),
    page: pick("page"),
    limit: String(PAGE_SIZE),
  });

  const page = Number(pick("page") ?? 1);
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="All properties"
        description="Every listing on RentNest, including hidden and archived ones."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox placeholder="Search title, address or city…" />

        <StatusFilter
          basePath="/admin-dashboard/properties"
          current={pick("status")}
          options={STATUS_OPTIONS}
        />
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : properties.length === 0 ? (
        <EmptyState
          icon={HouseLineIcon}
          title="No properties found"
          description="Try a different search term or status filter."
        />
      ) : (
        <>
          <p className="text-[11px] text-muted-foreground">
            Showing <span className="text-foreground">{properties.length}</span>{" "}
            of <span className="text-foreground">{meta?.total ?? 0}</span>
          </p>

          <ul className="divide-y divide-border border border-border">
            {properties.map((property) => (
              <li
                key={property.id}
                className="flex flex-wrap items-center gap-4 p-3.5"
              >
                <div className="relative size-12 shrink-0 overflow-hidden bg-muted">
                  {property.images?.[0] ? (
                    <Image
                      src={property.images[0]}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/properties/${property.id}`}
                    className="line-clamp-1 text-xs font-medium transition-colors hover:text-primary"
                  >
                    {property.title}
                  </Link>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {property.area}, {property.city}
                    {property.landlord && ` · ${property.landlord.name}`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-primary">
                    {formatCurrency(property.monthlyRent)}
                  </span>

                  <PropertyStatusBadge status={property.status} />
                </div>
              </li>
            ))}
          </ul>

          <PaginationNav
            basePath="/admin-dashboard/properties"
            page={page}
            totalPages={totalPages}
            searchParams={params}
          />
        </>
      )}
    </div>
  );
}

import { HouseLineIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusFilter } from "@/components/dashboard/status-filter";
import { PropertyRow } from "@/components/landlord/property-row";
import { Button } from "@/components/ui/button";
import { getMyProperties } from "@/service/landlord";

export const metadata: Metadata = { title: "My properties" };

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "RENTED", label: "Rented" },
  { value: "UNAVAILABLE", label: "Hidden" },
  { value: "ARCHIVED", label: "Archived" },
];

export default async function LandlordPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const { properties, error } = await getMyProperties({
    status,
    limit: "50",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Landlord"
        title="My properties"
        description="Create, edit and manage every listing you own."
        action={
          <Button
            size="lg"
            render={<Link href="/landloard-dashboard/properties/new" />}
          >
            <PlusIcon className="size-4" />
            Add property
          </Button>
        }
      />

      <StatusFilter
        basePath="/landloard-dashboard/properties"
        current={status}
        options={STATUS_OPTIONS}
      />

      {error ? (
        <ErrorState message={error} />
      ) : properties.length === 0 ? (
        <EmptyState
          icon={HouseLineIcon}
          title={status ? `No ${status.toLowerCase()} properties` : "No properties yet"}
          description={
            status
              ? "Try a different status filter."
              : "Add your first listing to start receiving rental requests."
          }
          action={
            <Button
              size="sm"
              render={<Link href="/landloard-dashboard/properties/new" />}
            >
              <PlusIcon className="size-3.5" />
              Add property
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {properties.map((property) => (
            <PropertyRow key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

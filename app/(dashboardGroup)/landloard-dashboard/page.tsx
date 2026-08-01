import {
  ClockIcon,
  CurrencyDollarIcon,
  HouseLineIcon,
  PlusIcon,
  TrayIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { PropertyRow } from "@/components/landlord/property-row";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/format";
import { getLandlordRequests, getMyProperties } from "@/service/landlord";

export const metadata: Metadata = { title: "Landlord dashboard" };

export default async function LandlordDashboardPage() {
  const [propertyResult, requestResult] = await Promise.all([
    getMyProperties({ limit: "100" }),
    getLandlordRequests({ limit: "100" }),
  ]);

  if (propertyResult.error) {
    return (
      <div className="space-y-8">
        <PageHeader eyebrow="Landlord" title="Overview" />
        <ErrorState message={propertyResult.error} />
      </div>
    );
  }

  const { properties } = propertyResult;
  const { requests } = requestResult;

  const availableCount = properties.filter(
    (property) => property.status === "AVAILABLE"
  ).length;

  const rentedCount = properties.filter(
    (property) => property.status === "RENTED"
  ).length;

  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING"
  );

  // Monthly income from active rentals.
  const monthlyIncome = requests
    .filter((request) => request.status === "ACTIVE")
    .reduce((sum, request) => sum + request.quotedAmount, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Landlord"
        title="Overview"
        description="Your listings, incoming requests and monthly income."
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Properties"
          value={properties.length}
          hint={`${availableCount} available · ${rentedCount} rented`}
          icon={HouseLineIcon}
        />
        <StatCard
          label="Pending requests"
          value={pendingRequests.length}
          hint="Needs your decision"
          icon={ClockIcon}
        />
        <StatCard
          label="Total requests"
          value={requests.length}
          icon={TrayIcon}
        />
        <StatCard
          label="Monthly income"
          value={formatCurrency(monthlyIncome)}
          hint="From active rentals"
          icon={CurrencyDollarIcon}
        />
      </div>

      {/* ── Decision prompt ── */}
      {pendingRequests.length > 0 && (
        <section className="border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium">
                {pendingRequests.length} request
                {pendingRequests.length > 1 ? "s" : ""} waiting for your decision
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Tenants can only pay after you approve.
              </p>
            </div>

            <Button
              size="sm"
              render={<Link href="/landloard-dashboard/requests?status=PENDING" />}
            >
              Review
            </Button>
          </div>

          <ul className="mt-4 space-y-2 border-t border-amber-500/20 pt-4">
            {pendingRequests.slice(0, 3).map((request) => (
              <li
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-2 text-[11px]"
              >
                <span className="min-w-0 truncate">
                  <span className="text-foreground">
                    {request.tenant?.name ?? "Tenant"}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {request.property?.title ?? "Property"}
                  </span>
                </span>

                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  {formatDate(request.moveInDate)}
                  <RentalStatusBadge status={request.status} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Property list ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Your properties
          </h2>

          {properties.length > 4 && (
            <Link
              href="/landloard-dashboard/properties"
              className="text-[10px] text-primary underline-offset-4 hover:underline"
            >
              View all ({properties.length})
            </Link>
          )}
        </div>

        {properties.length === 0 ? (
          <EmptyState
            icon={HouseLineIcon}
            title="No properties listed yet"
            description="Add your first listing and start receiving rental requests."
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
            {properties.slice(0, 4).map((property) => (
              <PropertyRow key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { TrayIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { RentalRequestCard } from "@/components/dashboard/rental-request-card";
import { StatusFilter } from "@/components/dashboard/status-filter";
import { Button } from "@/components/ui/button";
import { getMyRentals } from "@/service/rental";

export const metadata: Metadata = { title: "My requests" };

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "PAYMENT_PENDING", label: "Paying" },
  { value: "ACTIVE", label: "Active" },
  { value: "REJECTED", label: "Rejected" },
  { value: "COMPLETED", label: "Completed" },
];

export default async function TenantRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const { rentals, error } = await getMyRentals({
    status,
    limit: "50",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tenant"
        title="My rental requests"
        description="Every request you've sent, with its current status."
      />

      <StatusFilter
        basePath="/tenant-dashboard/requests"
        current={status}
        options={STATUS_OPTIONS}
      />

      {error ? (
        <ErrorState message={error} />
      ) : rentals.length === 0 ? (
        <EmptyState
          icon={TrayIcon}
          title={status ? `No ${status.toLowerCase()} requests` : "No requests yet"}
          description={
            status
              ? "Try a different status filter."
              : "Browse properties and send your first rental request."
          }
          action={
            <Button size="sm" render={<Link href="/properties" />}>
              Browse properties
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {rentals.map((rental) => (
            <RentalRequestCard key={rental.id} rental={rental} />
          ))}
        </div>
      )}
    </div>
  );
}

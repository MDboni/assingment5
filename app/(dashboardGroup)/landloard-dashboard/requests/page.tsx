import { TrayIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusFilter } from "@/components/dashboard/status-filter";
import { RequestList } from "@/components/landlord/request-list";
import { Button } from "@/components/ui/button";
import { getLandlordRequests } from "@/service/landlord";

export const metadata: Metadata = { title: "Rental requests" };

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "PAYMENT_PENDING", label: "Paying" },
  { value: "ACTIVE", label: "Active" },
  { value: "REJECTED", label: "Rejected" },
  { value: "COMPLETED", label: "Completed" },
];

export default async function LandlordRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const { requests, error } = await getLandlordRequests({
    status,
    limit: "50",
  });

  // সিদ্ধান্ত নেওয়ার বাকি গুলো সবার উপরে
  const sorted = [...requests].sort((a, b) => {
    const priority = (value: string) => (value === "PENDING" ? 0 : 1);
    return priority(a.status) - priority(b.status);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Landlord"
        title="Rental requests"
        description="Approve or reject requests for your properties."
      />

      <StatusFilter
        basePath="/landloard-dashboard/requests"
        current={status}
        options={STATUS_OPTIONS}
      />

      {error ? (
        <ErrorState message={error} />
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={TrayIcon}
          title={status ? `No ${status.toLowerCase()} requests` : "No requests yet"}
          description={
            status
              ? "Try a different status filter."
              : "Requests will appear here once tenants apply to your properties."
          }
          action={
            <Button
              size="sm"
              render={<Link href="/landloard-dashboard/properties" />}
            >
              View my properties
            </Button>
          }
        />
      ) : (
        <RequestList requests={sorted} />
      )}
    </div>
  );
}

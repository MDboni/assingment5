import {
  ClockIcon,
  CreditCardIcon,
  HouseLineIcon,
  TrayIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { RentalRequestCard } from "@/components/dashboard/rental-request-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { getMyPayments } from "@/service/payment";
import { getMyRentals } from "@/service/rental";

export const metadata: Metadata = { title: "Tenant dashboard" };

export default async function TenantDashboardPage() {
  // Run both calls at the same time — neither waits for the other.
  const [rentalResult, paymentResult] = await Promise.all([
    getMyRentals({ limit: "50" }),
    getMyPayments({ limit: "50" }),
  ]);

  if (rentalResult.error) {
    return (
      <div className="space-y-8">
        <PageHeader eyebrow="Tenant" title="Overview" />
        <ErrorState message={rentalResult.error} />
      </div>
    );
  }

  const { rentals } = rentalResult;

  const pendingCount = rentals.filter((r) => r.status === "PENDING").length;
  const activeCount = rentals.filter((r) => r.status === "ACTIVE").length;
  const payableCount = rentals.filter((r) => r.status === "APPROVED").length;

  const totalPaid = paymentResult.payments
    .filter((payment) => payment.status === "COMPLETED")
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Show the latest three, but put unpaid ones first.
  const highlighted = [...rentals]
    .sort((a, b) => {
      const priority = (status: string) => (status === "APPROVED" ? 0 : 1);
      return priority(a.status) - priority(b.status);
    })
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tenant"
        title="Overview"
        description="Track your rental requests and payments in one place."
        action={
          <Button size="lg" render={<Link href="/properties" />}>
            Browse rentals
          </Button>
        }
      />

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total requests"
          value={rentals.length}
          icon={TrayIcon}
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          hint="Waiting for landlord"
          icon={ClockIcon}
        />
        <StatCard
          label="Active rentals"
          value={activeCount}
          hint="Paid and running"
          icon={HouseLineIcon}
        />
        <StatCard
          label="Total paid"
          value={formatCurrency(totalPaid)}
          icon={CreditCardIcon}
        />
      </div>

      {/* ── Payment reminder ── */}
      {payableCount > 0 && (
        <div className="border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-medium text-primary">
            {payableCount} request{payableCount > 1 ? "s" : ""} approved —
            complete payment to activate your rental.
          </p>
        </div>
      )}

      {/* ── Recent requests ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Recent requests
          </h2>

          {rentals.length > 3 && (
            <Link
              href="/tenant-dashboard/requests"
              className="text-[10px] text-primary underline-offset-4 hover:underline"
            >
              View all ({rentals.length})
            </Link>
          )}
        </div>

        {highlighted.length === 0 ? (
          <EmptyState
            icon={TrayIcon}
            title="No rental requests yet"
            description="Find a property you like and send your first request."
            action={
              <Button size="sm" render={<Link href="/properties" />}>
                Browse properties
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {highlighted.map((rental) => (
              <RentalRequestCard key={rental.id} rental={rental} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

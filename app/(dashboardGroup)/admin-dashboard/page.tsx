import {
  ClockIcon,
  HouseLineIcon,
  TrayIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { ROLE_LABEL } from "@/lib/roles";
import { formatCurrency, formatDate } from "@/lib/format";
import { getAllRentals, getAllUsers } from "@/service/admin";

export const metadata: Metadata = { title: "Admin dashboard" };

export default async function AdminDashboardPage() {
  const [userResult, rentalResult] = await Promise.all([
    getAllUsers({ limit: "200" }),
    getAllRentals({ limit: "200" }),
  ]);

  if (userResult.error) {
    return (
      <div className="space-y-8">
        <PageHeader eyebrow="Admin" title="Overview" />
        <ErrorState message={userResult.error} />
      </div>
    );
  }

  const users = userResult.data;
  const rentals = rentalResult.data;

  const countByRole = (role: string) =>
    users.filter((user) => user.role === role).length;

  const bannedCount = users.filter((user) => user.status === "BANNED").length;
  const pendingRentals = rentals.filter((r) => r.status === "PENDING").length;
  const activeRentals = rentals.filter((r) => r.status === "ACTIVE").length;

  // প্রতিটা landlord-এর property যোগ করলেই মোট property
  const totalProperties = users.reduce(
    (sum, user) => sum + (user._count?.properties ?? 0),
    0
  );

  const grossValue = rentals
    .filter((r) => r.status === "ACTIVE")
    .reduce((sum, r) => sum + r.quotedAmount, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Platform overview"
        description="Users, listings and rental activity across RentNest."
        action={
          <Button size="lg" render={<Link href="/admin-dashboard/users" />}>
            Manage users
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={users.length}
          hint={`${bannedCount} banned`}
          icon={UsersThreeIcon}
        />
        <StatCard
          label="Properties"
          value={totalProperties}
          icon={HouseLineIcon}
        />
        <StatCard
          label="Pending requests"
          value={pendingRentals}
          hint={`${activeRentals} active`}
          icon={ClockIcon}
        />
        <StatCard
          label="Active rent value"
          value={formatCurrency(grossValue)}
          hint="Per month"
          icon={TrayIcon}
        />
      </div>

      {/* ── role অনুযায়ী ভাগ ── */}
      <section className="grid gap-px border border-border bg-border sm:grid-cols-3">
        {(["TENANT", "LANDLORD", "ADMIN"] as const).map((role) => (
          <div key={role} className="bg-background p-5">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {ROLE_LABEL[role]}s
            </p>

            <p className="mt-3 text-2xl font-semibold tracking-tight">
              {countByRole(role)}
            </p>

            <Link
              href={`/admin-dashboard/users?role=${role}`}
              className="mt-2 inline-block text-[10px] text-primary underline-offset-4 hover:underline"
            >
              View list →
            </Link>
          </div>
        ))}
      </section>

      {/* ── সাম্প্রতিক rental ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Recent rental activity
          </h2>

          <Link
            href="/admin-dashboard/rentals"
            className="text-[10px] text-primary underline-offset-4 hover:underline"
          >
            View all ({rentals.length})
          </Link>
        </div>

        {rentals.length === 0 ? (
          <p className="border border-dashed border-border p-8 text-center text-[11px] text-muted-foreground">
            No rental requests on the platform yet.
          </p>
        ) : (
          <ul className="divide-y divide-border border border-border">
            {rentals.slice(0, 6).map((rental) => (
              <li
                key={rental.id}
                className="flex flex-wrap items-center justify-between gap-3 p-3.5"
              >
                <div className="min-w-0">
                  <p className="line-clamp-1 text-[11px] font-medium">
                    {rental.property?.title ?? "Property"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {rental.tenant?.name ?? "Tenant"} ·{" "}
                    {formatDate(rental.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-primary">
                    {formatCurrency(rental.quotedAmount)}
                  </span>
                  <RentalStatusBadge status={rental.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

import { TrayIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusFilter } from "@/components/dashboard/status-filter";
import { PaginationNav } from "@/components/shared/pagination-nav";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import { getAllRentals } from "@/service/admin";

export const metadata: Metadata = { title: "All rentals" };

const PAGE_SIZE = 15;

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminRentalsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const pick = (key: string) =>
    typeof params[key] === "string" && params[key] ? params[key] : undefined;

  const { data: rentals, meta, error } = await getAllRentals({
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
        title="All rental requests"
        description="Every request across the platform, from enquiry to completion."
      />

      <StatusFilter
        basePath="/admin-dashboard/rentals"
        current={pick("status")}
        options={STATUS_OPTIONS}
      />

      {error ? (
        <ErrorState message={error} />
      ) : rentals.length === 0 ? (
        <EmptyState
          icon={TrayIcon}
          title="No rental requests found"
          description="Try a different status filter."
        />
      ) : (
        <>
          <div className="overflow-x-auto border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                    Property
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                    Tenant
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                    Move-in
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                    Amount
                  </TableHead>
                  <TableHead className="text-right text-[10px] uppercase tracking-[0.12em]">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell>
                      <Link
                        href={`/properties/${rental.propertyId}`}
                        className="line-clamp-1 text-xs transition-colors hover:text-primary"
                      >
                        {rental.property?.title ?? "Property"}
                      </Link>
                    </TableCell>

                    <TableCell className="text-[11px]">
                      {rental.tenant?.name ?? "—"}
                    </TableCell>

                    <TableCell className="text-[10px] text-muted-foreground">
                      {formatDate(rental.moveInDate)}
                    </TableCell>

                    <TableCell className="text-xs font-medium">
                      {formatCurrency(rental.quotedAmount)}
                    </TableCell>

                    <TableCell className="text-right">
                      <RentalStatusBadge status={rental.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <PaginationNav
            basePath="/admin-dashboard/rentals"
            page={page}
            totalPages={totalPages}
            searchParams={params}
          />
        </>
      )}
    </div>
  );
}

import { CreditCardIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import { getMyPayments } from "@/service/payment";

export const metadata: Metadata = { title: "Payments" };

export default async function TenantPaymentsPage() {
  const { payments, error } = await getMyPayments({ limit: "50" });

  const totalPaid = payments
    .filter((payment) => payment.status === "COMPLETED")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tenant"
        title="Payment history"
        description={
          payments.length > 0
            ? `${formatCurrency(totalPaid)} paid across ${payments.length} transaction${payments.length > 1 ? "s" : ""}.`
            : undefined
        }
      />

      {error ? (
        <ErrorState message={error} />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCardIcon}
          title="No payments yet"
          description="Once a landlord approves your request, you can pay here."
          action={
            <Button size="sm" render={<Link href="/tenant-dashboard/requests" />}>
              View my requests
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                  Transaction
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                  Amount
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                  Provider
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.12em]">
                  Status
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-[0.12em]">
                  Paid at
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-[10px]">
                    {payment.transactionId}
                  </TableCell>

                  <TableCell className="text-xs font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>

                  <TableCell className="text-[10px] text-muted-foreground">
                    {payment.provider}
                  </TableCell>

                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>

                  <TableCell className="text-right text-[10px] text-muted-foreground">
                    {payment.paidAt ? formatDate(payment.paidAt) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

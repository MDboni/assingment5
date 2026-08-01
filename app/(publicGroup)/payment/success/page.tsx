import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { PaymentStatusPoller } from "@/components/payment/payment-status-poller";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { getMyPayments } from "@/service/payment";

export const metadata: Metadata = { title: "Payment successful" };

export default async function PaymentSuccessPage() {
  // The most recent payment is the one that was just made.
  const { payments } = await getMyPayments({ limit: "1" });
  const payment = payments[0] ?? null;

  const isConfirmed = payment?.status === "COMPLETED";

  return (
    <div className="mx-auto grid min-h-[70vh] w-full max-w-md place-items-center px-5 py-16">
      <div className="w-full text-center">
        <span className="mx-auto grid size-14 place-items-center border border-primary/30 bg-primary/10">
          <CheckCircleIcon weight="fill" className="size-6 text-primary" />
        </span>

        <h1 className="mt-6 text-xl font-semibold tracking-tight">
          {isConfirmed ? "Payment successful" : "Payment received"}
        </h1>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {isConfirmed
            ? "Your rental is now active. The landlord has been notified."
            : "We're confirming your payment with Stripe. This usually takes a few seconds."}
        </p>

        {/* ── Receipt ── */}
        {payment && (
          <dl className="mt-8 space-y-2.5 border border-border bg-card p-5 text-left">
            <Row label="Transaction">
              <span className="font-mono text-[10px]">
                {payment.transactionId}
              </span>
            </Row>

            <Row label="Amount">
              <span className="font-medium">
                {formatCurrency(payment.amount)}
              </span>
            </Row>

            <Row label="Provider">
              <span className="text-muted-foreground">{payment.provider}</span>
            </Row>

            <Row label="Status">
              <PaymentStatusBadge status={payment.status} />
            </Row>
          </dl>
        )}

        {/* Keep refreshing automatically until it is confirmed */}
        {!isConfirmed && <PaymentStatusPoller />}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            render={<Link href="/tenant-dashboard/requests" />}
          >
            View my rentals
          </Button>

          <Button
            variant="outline"
            size="lg"
            render={<Link href="/tenant-dashboard/payments" />}
          >
            Payment history
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-[11px]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate">{children}</dd>
    </div>
  );
}

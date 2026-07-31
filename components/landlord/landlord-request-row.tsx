"use client";

import {
  CalendarBlankIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  UserIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

import { CompleteRentalButton } from "@/components/landlord/complete-rental-button";
import { RequestDecision } from "@/components/landlord/request-decision";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { RentalRequest } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LandlordRequestRow({
  request,
  onDecide,
  isPending,
}: {
  request: RentalRequest;
  onDecide: (
    requestId: string,
    status: "APPROVED" | "REJECTED",
    landloardNote?: string
  ) => void;
  isPending: boolean;
}) {
  const tenantName = request.tenant?.name ?? "Tenant";
  const propertyTitle = request.property?.title ?? "Property";

  return (
    <article
      className={cn(
        "border border-border bg-card p-4 transition-opacity",
        isPending && "opacity-70"
      )}
    >
      {/* ── উপরের সারি ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/properties/${request.propertyId}`}
            className="line-clamp-1 text-xs font-medium transition-colors hover:text-primary"
          >
            {propertyTitle}
          </Link>

          <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <UserIcon className="size-3" />
            {tenantName}
          </p>
        </div>

        <RentalStatusBadge status={request.status} />
      </div>

      {/* ── যোগাযোগ ── */}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] text-muted-foreground">
        {request.tenant?.email && (
          <span className="inline-flex items-center gap-1">
            <EnvelopeSimpleIcon className="size-3" />
            {request.tenant.email}
          </span>
        )}

        {request.tenant?.phone && (
          <span className="inline-flex items-center gap-1">
            <PhoneIcon className="size-3" />
            {request.tenant.phone}
          </span>
        )}

        <span className="inline-flex items-center gap-1">
          <CalendarBlankIcon className="size-3" />
          Move-in {formatDate(request.moveInDate)}
        </span>

        {request.moveOutDate && (
          <span>Move-out {formatDate(request.moveOutDate)}</span>
        )}
      </div>

      {/* ── tenant-এর বার্তা ── */}
      {request.message && (
        <p className="mt-3 border-l-2 border-border bg-muted/40 px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">
          <span className="text-foreground">{tenantName}:</span>{" "}
          {request.message}
        </p>
      )}

      {/* ── নিজের আগের নোট ── */}
      {request.landloardNote && (
        <p className="mt-2 border-l-2 border-primary/40 bg-primary/5 px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">
          <span className="text-foreground">Your note:</span>{" "}
          {request.landloardNote}
        </p>
      )}

      {/* ── নিচের সারি ── */}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-4">
        <div>
          <p className="text-sm font-semibold text-primary">
            {formatCurrency(request.quotedAmount)}
          </p>
          <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
            per month
          </p>
        </div>

        {/* status অনুযায়ী কী করা যাবে */}
        {request.status === "PENDING" && (
          <RequestDecision
            requestId={request.id}
            tenantName={tenantName}
            propertyTitle={propertyTitle}
            quotedAmount={request.quotedAmount}
            onDecide={onDecide}
            isPending={isPending}
          />
        )}

        {request.status === "APPROVED" && (
          <p className="text-[10px] text-muted-foreground">
            Waiting for tenant payment…
          </p>
        )}

        {request.status === "PAYMENT_PENDING" && (
          <p className="text-[10px] text-muted-foreground">
            Payment in progress…
          </p>
        )}

        {request.status === "ACTIVE" && (
          <CompleteRentalButton requestId={request.id} />
        )}
      </div>
    </article>
  );
}

import { CalendarBlankIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import { PayNowButton } from "@/components/dashboard/pay-now-button";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { CancelRequestButton } from "@/components/tenant/cancel-request-button";
import { ReviewDialog } from "@/components/tenant/review-dialog";
import { formatCurrency, formatDate } from "@/lib/format";
import type { RentalRequest } from "@/lib/types";

export function RentalRequestCard({ rental }: { rental: RentalRequest }) {
  const property = rental.property;
  const cover = property?.images?.[0];
  const propertyTitle = property?.title ?? "Property";

  // backend শুধু PENDING আর APPROVED cancel করতে দেয়
  const canCancel =
    rental.status === "PENDING" || rental.status === "APPROVED";

  return (
    <article className="flex flex-col gap-4 border border-border bg-card p-4 sm:flex-row">
      {/* ── থাম্বনেইল ── */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted sm:w-36">
        {cover ? (
          <Image
            src={cover}
            alt={property?.title ?? "Property"}
            fill
            sizes="144px"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* ── তথ্য ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/properties/${rental.propertyId}`}
              className="line-clamp-1 text-xs font-medium transition-colors hover:text-primary"
            >
              {property?.title ?? "Property"}
            </Link>

            {(property?.area || property?.city) && (
              <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPinIcon className="size-3" />
                {property.area}, {property.city}
              </p>
            )}
          </div>

          <RentalStatusBadge status={rental.status} />
        </div>

        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[10px]">
          <div className="inline-flex items-center gap-1.5">
            <CalendarBlankIcon className="size-3 text-muted-foreground" />
            <dt className="text-muted-foreground">Move-in</dt>
            <dd>{formatDate(rental.moveInDate)}</dd>
          </div>

          <div className="inline-flex items-center gap-1.5">
            <dt className="text-muted-foreground">Landlord</dt>
            <dd>{rental.landlord?.name ?? "—"}</dd>
          </div>
        </dl>

        {rental.landloardNote && (
          <p className="mt-3 border-l-2 border-border bg-muted/40 px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">
            <span className="text-foreground">Landlord note:</span>{" "}
            {rental.landloardNote}
          </p>
        )}

        {/* ── নিচের সারি ── */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              {formatCurrency(rental.quotedAmount)}
            </p>
            <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
              per month
            </p>
          </div>

          {/* status অনুযায়ী tenant কী করতে পারে */}
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {canCancel && (
              <CancelRequestButton
                rentalRequestId={rental.id}
                propertyTitle={propertyTitle}
              />
            )}

            {/* APPROVED হলেই কেবল টাকা দেওয়ার সুযোগ */}
            {rental.status === "APPROVED" && (
              <PayNowButton rentalRequestId={rental.id} />
            )}

            {rental.status === "PAYMENT_PENDING" && (
              <p className="text-[10px] text-muted-foreground">
                Awaiting confirmation…
              </p>
            )}

            {rental.status === "ACTIVE" && (
              <p className="text-[10px] text-muted-foreground">
                Review unlocks when the rental ends
              </p>
            )}

            {/* backend শুধু COMPLETED rental-এ review নেয় */}
            {rental.status === "COMPLETED" && (
              <ReviewDialog
                rentalRequestId={rental.id}
                propertyTitle={propertyTitle}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

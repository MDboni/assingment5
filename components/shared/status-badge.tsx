import type { PaymentStatus, PropertyStatus, RentalStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/** assignment-এ যে রঙগুলো চাওয়া হয়েছে, হুবহু সেগুলোই */
const RENTAL_STYLE: Record<RentalStatus, string> = {
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  APPROVED: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",
  PAYMENT_PENDING:
    "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  ACTIVE: "border-primary/30 bg-primary/10 text-primary",
  COMPLETED: "border-border bg-muted text-muted-foreground",
  CANCELLED: "border-border bg-muted text-muted-foreground",
};

const PAYMENT_STYLE: Record<PaymentStatus, string> = {
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  COMPLETED: "border-primary/30 bg-primary/10 text-primary",
  FAILED: "border-destructive/30 bg-destructive/10 text-destructive",
  CANCELED: "border-border bg-muted text-muted-foreground",
  REFUNDED: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

const PROPERTY_STYLE: Record<PropertyStatus, string> = {
  AVAILABLE: "border-primary/30 bg-primary/10 text-primary",
  UNAVAILABLE: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  RENTED: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ARCHIVED: "border-border bg-muted text-muted-foreground",
};

const base =
  "inline-block border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] whitespace-nowrap";

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  return (
    <span className={cn(base, RENTAL_STYLE[status])}>
      {status.replace("_", " ")}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={cn(base, PAYMENT_STYLE[status])}>{status}</span>;
}

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  return <span className={cn(base, PROPERTY_STYLE[status])}>{status}</span>;
}

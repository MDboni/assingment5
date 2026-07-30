import { XCircleIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto grid min-h-[70vh] w-full max-w-md place-items-center px-5 py-16">
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center border border-destructive/30 bg-destructive/10">
          <XCircleIcon weight="fill" className="size-6 text-destructive" />
        </span>

        <h1 className="mt-6 text-xl font-semibold tracking-tight">
          Payment cancelled
        </h1>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          No money was taken. Your rental request is still approved — you can
          try paying again whenever you&apos;re ready.
        </p>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button size="lg" render={<Link href="/tenant-dashboard/requests" />}>
            Try again
          </Button>

          <Button variant="outline" size="lg" render={<Link href="/properties" />}>
            Browse rentals
          </Button>
        </div>
      </div>
    </div>
  );
}

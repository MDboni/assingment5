import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden border border-border bg-primary/5 p-10 lg:p-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-lg">
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary">
            For landlords
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Have a property sitting empty?
          </h2>

          <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
            List it in minutes, review incoming requests from one dashboard, and
            get paid without chasing anyone.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button size="lg" render={<Link href="/register" />}>
            List your property
          </Button>

          <Button variant="outline" size="lg" render={<Link href="/properties" />}>
            Browse rentals
          </Button>
        </div>
      </div>
    </section>
  );
}


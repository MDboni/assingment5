import { HouseLineIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PropertyNotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] w-full max-w-md place-items-center px-5 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center border border-border bg-muted">
          <HouseLineIcon className="size-5 text-muted-foreground" />
        </span>

        <h1 className="mt-6 text-xl font-semibold tracking-tight">
          Property not found
        </h1>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          This listing may have been removed, rented out, or archived by the
          landlord.
        </p>

        <Button size="lg" className="mt-6" render={<Link href="/properties" />}>
          Browse other rentals
        </Button>
      </div>
    </div>
  );
}

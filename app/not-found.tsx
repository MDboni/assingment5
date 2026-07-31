import { CompassIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-md place-items-center px-5 py-16">
      <div className="text-center">
        <p className="font-mono text-6xl font-semibold tracking-tighter text-primary/20">
          404
        </p>

        <span className="mx-auto mt-2 grid size-12 place-items-center border border-border bg-muted">
          <CompassIcon className="size-5 text-muted-foreground" />
        </span>

        <h1 className="mt-6 text-xl font-semibold tracking-tight">
          Page not found
        </h1>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button size="lg" render={<Link href="/" />}>
            Back to home
          </Button>

          <Button variant="outline" size="lg" render={<Link href="/properties" />}>
            Browse rentals
          </Button>
        </div>
      </div>
    </div>
  );
}

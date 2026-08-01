"use client"; 

import { ArrowClockwiseIcon, WarningCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // In a real app, this is where we'd send it to a service like Sentry.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto grid min-h-[70vh] w-full max-w-md place-items-center px-5 py-16">
      <div className="text-center">
        <span className="mx-auto grid size-14 place-items-center border border-destructive/30 bg-destructive/10">
          <WarningCircleIcon weight="fill" className="size-6 text-destructive" />
        </span>

        <h1 className="mt-6 text-xl font-semibold tracking-tight">
          Something went wrong
        </h1>

        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          We hit an unexpected error while loading this page. You can try again,
          or head back home.
        </p>

        {/* digest is the ID for finding this error in server logs */}
        {error.digest && (
          <p className="mt-4 border border-border bg-muted/40 px-3 py-2 font-mono text-[10px] text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button size="lg" onClick={() => unstable_retry()}>
            <ArrowClockwiseIcon className="size-4" />
            Try again
          </Button>

          <Button variant="outline" size="lg" render={<Link href="/" />}>
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}

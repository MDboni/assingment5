"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Stripe's webhook can take a few seconds to reach the backend.
 * Until then, the page keeps refreshing on its own, so the user
 * does not need to press refresh.
 */
export function PaymentStatusPoller({ maxAttempts = 6 }: { maxAttempts?: number }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (attempt >= maxAttempts) return;

    const timer = setTimeout(() => {
      router.refresh();
      setAttempt((current) => current + 1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [attempt, maxAttempts, router]);

  if (attempt >= maxAttempts) {
    return (
      <p className="mt-4 text-[10px] text-muted-foreground">
        Still processing. Your payment is safe — check{" "}
        <span className="text-foreground">Payments</span> in a minute.
      </p>
    );
  }

  return (
    <p className="mt-4 inline-flex items-center gap-2 text-[10px] text-muted-foreground">
      <span className="size-1.5 animate-pulse rounded-full bg-primary" />
      Confirming with the payment provider…
    </p>
  );
}

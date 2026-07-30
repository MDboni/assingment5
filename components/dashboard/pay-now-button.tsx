"use client";

import { CreditCardIcon, SpinnerIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { startCheckout } from "@/service/payment.action";

export function PayNowButton({
  rentalRequestId,
  className,
}: {
  rentalRequestId: string;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    const result = await startCheckout(rentalRequestId);

    if (!result.success || !result.checkoutUrl) {
      toast.error(result.message);
      setIsLoading(false);
      return;
    }

    toast.success(result.message);

    // Stripe-এর নিজের ডোমেইনে যাচ্ছি — router.push নয়, পুরো navigation
    window.location.href = result.checkoutUrl;
  };

  return (
    <Button
      size="sm"
      className={className}
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? (
        <>
          <SpinnerIcon className="size-3.5 animate-spin" />
          Redirecting…
        </>
      ) : (
        <>
          <CreditCardIcon className="size-3.5" />
          Pay now
        </>
      )}
    </Button>
  );
}

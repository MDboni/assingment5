"use server";

import { authFetch } from "@/utils/api";

type CheckoutSession = {
  checkoutUrl: string | null;
  paymentId: string;
  transactionId: string;
  amount: number;
  currency: string;
};

export type CheckoutState = {
  success: boolean;
  message: string;
  checkoutUrl?: string;
};

/** POST /api/payments/create → Stripe Checkout-এর URL */
export const startCheckout = async (
  rentalRequestId: string
): Promise<CheckoutState> => {
  const result = await authFetch<CheckoutSession>("/api/payments/create", {
    method: "POST",
    body: JSON.stringify({ rentalRequestId }),
  });

  if (!result) {
    return {
      success: false,
      message: "Cannot reach the server. Please try again.",
    };
  }

  if (!result.success) {
    return { success: false, message: result.message };
  }

  if (!result.data.checkoutUrl) {
    return {
      success: false,
      message: "Stripe did not return a checkout URL.",
    };
  }

  return {
    success: true,
    message: "Redirecting to secure checkout…",
    checkoutUrl: result.data.checkoutUrl,
  };
};

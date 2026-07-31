"use server";

import { revalidateTag } from "next/cache";

import type { Review } from "@/lib/types";
import { authFetch } from "@/utils/api";

export type ReviewActionState = {
  success: boolean;
  message: string;
};

/**
 * POST /api/reviews
 * Backend শর্ত: rental টা নিজের হতে হবে, status COMPLETED হতে হবে,
 * আর প্রতি rental-এ একটাই review।
 */
export const createReview = async (payload: {
  rentalRequestId: string;
  rating: number;
  comment?: string;
}): Promise<ReviewActionState> => {
  const result = await authFetch<Review>("/api/reviews", {
    method: "POST",
    body: JSON.stringify({
      rentalRequestId: payload.rentalRequestId,
      rating: payload.rating,
      ...(payload.comment ? { comment: payload.comment } : {}),
    }),
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

  // property page-এর review তালিকা আর rating গড় সাথে সাথে নতুন হোক
  revalidateTag("properties", "max");
  revalidateTag("my-rentals", "max");

  return { success: true, message: result.message };
};

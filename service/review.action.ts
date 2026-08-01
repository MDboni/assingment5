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
 * Backend requirements: the rental must belong to the user, its status must be COMPLETED,
 * and each rental can only have one review.
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

  // Update the property page review list and average rating immediately.
  revalidateTag("properties", "max");
  revalidateTag("my-rentals", "max");

  return { success: true, message: result.message };
};

"use server";

import { revalidateTag } from "next/cache";

import type { ApiError, RentalRequest } from "@/lib/types";
import { authFetch } from "@/utils/api";

export type RentalActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

const toFieldErrors = (error: ApiError) => {
  if (!error.errorDetails?.length) return undefined;

  return error.errorDetails.reduce<Record<string, string>>((acc, detail) => {
    const field = detail.path.split(".").pop();
    if (field) acc[field] = detail.message;
    return acc;
  }, {});
};

export const createRentalRequest = async (payload: {
  propertyId: string;
  moveInDate: string;
  moveOutDate?: string;
  message?: string;
}): Promise<RentalActionState> => {
  const result = await authFetch<RentalRequest>("/api/rentals", {
    method: "POST",
    body: JSON.stringify({
      propertyId: payload.propertyId,
      // The backend expects ISO datetimes, while <input type="date"> gives "2026-08-15".
      moveInDate: new Date(payload.moveInDate).toISOString(),
      ...(payload.moveOutDate
        ? { moveOutDate: new Date(payload.moveOutDate).toISOString() }
        : {}),
      ...(payload.message ? { message: payload.message } : {}),
    }),
  });

  if (!result) {
    return {
      success: false,
      message: "Cannot reach the server. Please try again.",
    };
  }

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      fieldErrors: toFieldErrors(result),
    };
  }

  revalidateTag("my-rentals", "max");

  return { success: true, message: result.message };
};

/**
 * PATCH /api/rentals/:id/cancel
 * The backend only allows PENDING and APPROVED requests to be canceled.
 */
export const cancelRentalRequest = async (
  rentalRequestId: string
): Promise<RentalActionState> => {
  const result = await authFetch<RentalRequest>(
    `/api/rentals/${rentalRequestId}/cancel`,
    { method: "PATCH" }
  );

  if (!result) {
    return {
      success: false,
      message: "Cannot reach the server. Please try again.",
    };
  }

  if (!result.success) {
    return { success: false, message: result.message };
  }

  revalidateTag("my-rentals", "max");
  revalidateTag("landlord-requests", "max");

  return { success: true, message: result.message };
};

"use server";

import { revalidateTag } from "next/cache";

import type { ApiError, LandlordProperty, RentalRequest } from "@/lib/types";
import { authFetch } from "@/utils/api";

export type LandlordActionState = {
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

/** create আর update — দুটোর payload একই আকারের */
export type PropertyPayload = {
  title: string;
  description: string;
  categoryId: string;
  address: string;
  city: string;
  area: string;
  monthlyRent: number;
  securityDeposit: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  amenities: string[];
  images: string[];
  availableFrom?: string;
  status?: "AVAILABLE" | "UNAVAILABLE" | "ARCHIVED";
};

const refreshProperties = () => {
  revalidateTag("properties", "max");
  revalidateTag("my-properties", "max");
};

export const createProperty = async (
  payload: PropertyPayload
): Promise<LandlordActionState> => {
  const result = await authFetch<LandlordProperty>("/api/landlord/properties", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      ...(payload.availableFrom
        ? { availableFrom: new Date(payload.availableFrom).toISOString() }
        : {}),
    }),
  });

  if (!result) {
    return { success: false, message: "Cannot reach the server." };
  }

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      fieldErrors: toFieldErrors(result),
    };
  }

  refreshProperties();

  return { success: true, message: result.message };
};

export const updateProperty = async (
  propertyId: string,
  payload: Partial<PropertyPayload>
): Promise<LandlordActionState> => {
  const result = await authFetch<LandlordProperty>(
    `/api/landlord/properties/${propertyId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        ...payload,
        ...(payload.availableFrom
          ? { availableFrom: new Date(payload.availableFrom).toISOString() }
          : {}),
      }),
    }
  );

  if (!result) {
    return { success: false, message: "Cannot reach the server." };
  }

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      fieldErrors: toFieldErrors(result),
    };
  }

  refreshProperties();
  revalidateTag(`property-${propertyId}`, "max");

  return { success: true, message: result.message };
};

export const deleteProperty = async (
  propertyId: string
): Promise<LandlordActionState> => {
  const result = await authFetch<unknown>(
    `/api/landlord/properties/${propertyId}`,
    { method: "DELETE" }
  );

  if (!result) {
    return { success: false, message: "Cannot reach the server." };
  }

  if (!result.success) {
    return { success: false, message: result.message };
  }

  refreshProperties();

  // backend চলমান rental থাকলে delete না করে ARCHIVE করে —
  // তাই ওর নিজের message-টাই দেখাচ্ছি, নিজে বানাচ্ছি না
  return { success: true, message: result.message };
};

/** approve / reject */
export const decideRentalRequest = async (
  requestId: string,
  payload: { status: "APPROVED" | "REJECTED"; landloardNote?: string }
): Promise<LandlordActionState> => {
  const result = await authFetch<RentalRequest>(
    `/api/landlord/requests/${requestId}`,
    { method: "PATCH", body: JSON.stringify(payload) }
  );

  if (!result) {
    return { success: false, message: "Cannot reach the server." };
  }

  if (!result.success) {
    return { success: false, message: result.message };
  }

  revalidateTag("landlord-requests", "max");
  revalidateTag("my-rentals", "max");

  return { success: true, message: result.message };
};

/** ACTIVE rental শেষ করা */
export const completeRentalRequest = async (
  requestId: string
): Promise<LandlordActionState> => {
  const result = await authFetch<RentalRequest>(
    `/api/landlord/requests/${requestId}/complete`,
    { method: "PATCH" }
  );

  if (!result) {
    return { success: false, message: "Cannot reach the server." };
  }

  if (!result.success) {
    return { success: false, message: result.message };
  }

  revalidateTag("landlord-requests", "max");
  revalidateTag("my-rentals", "max");
  refreshProperties();

  return { success: true, message: result.message };
};

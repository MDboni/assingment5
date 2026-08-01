"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import type { ApiError, ApiResult, LoginResponse, User, UserRole } from "@/lib/types";

export type ActionState = {
  success: boolean;
  message: string;
  /** Field-wise errors for showing inline in the form. */
  fieldErrors?: Record<string, string>;
  role?: UserRole; // Used by loginUser for redirects.
};

/** Convert backend errorDetails[] into { email: "...", password: "..." }. */
const toFieldErrors = (error: ApiError) => {
  if (!error.errorDetails?.length) return undefined;

  return error.errorDetails.reduce<Record<string, string>>((acc, detail) => {
    // The backend sends paths like "body.email" — the last part is the field name.
    const field = detail.path.split(".").pop();

    if (field) acc[field] = detail.message;

    return acc;
  }, {});
};

/** Common fetch helper for all auth requests — network failures are handled separately. */
const postToBackend = async <T>(
  path: string,
  payload: unknown
): Promise<ApiResult<T> | null> => {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    return (await res.json()) as ApiResult<T>;
  } catch {
    // Backend down / network failure → null.
    return null;
  }
};

export const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<ActionState> => {
  const result = await postToBackend<LoginResponse>(
    "/api/auth/login",
    payload
  );

  if (!result) {
    return {
      success: false,
      message: "Cannot reach the server. Please try again.",
    };
  }

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Login failed",
      fieldErrors: toFieldErrors(result),
    };
  }

  const { accessToken, refreshToken } = result.data;

  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day — matches the backend expiry.
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // getMe was cached — refresh so the new user's data appears immediately.
  revalidateTag("my-profile", "max");

  return { success: true, message: result.message };
};

export const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "LANDLORD";
  phone?: string;
}): Promise<ActionState> => {
  const result = await postToBackend<User>("/api/auth/register", payload);

  if (!result) {
    return {
      success: false,
      message: "Cannot reach the server. Please try again.",
    };
  }

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Registration failed",
      fieldErrors: toFieldErrors(result),
    };
  }

  return { success: true, message: result.message };
};

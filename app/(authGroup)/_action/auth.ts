"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

import type { ApiError, ApiResult, LoginResponse, User } from "@/lib/types";

export type ActionState = {
  success: boolean;
  message: string;
  /** field-wise error → form-এ inline দেখানোর জন্য */
  fieldErrors?: Record<string, string>;
};

/** backend-এর errorDetails[] → { email: "...", password: "..." } */
const toFieldErrors = (error: ApiError) => {
  if (!error.errorDetails?.length) return undefined;

  return error.errorDetails.reduce<Record<string, string>>((acc, detail) => {
    // backend path পাঠায় "body.email" আকারে — শেষ অংশটাই field name
    const field = detail.path.split(".").pop();

    if (field) acc[field] = detail.message;

    return acc;
  }, {});
};

/** সব auth request-এর common fetch — network fail আলাদা করে ধরা হয় */
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
    // backend বন্ধ / network fail → null
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
    maxAge: 60 * 60 * 24, // 1 day — backend-এর expiry-র সাথে মেলানো
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // getMe cached ছিল — নতুন user-এর data যেন সাথে সাথেই আসে
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

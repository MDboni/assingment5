"use server";

import { revalidateTag } from "next/cache";

import type { ApiError, User } from "@/lib/types";
import { authFetch } from "@/utils/api";

export type UserActionState = {
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

export const updateMyProfile = async (payload: {
  name?: string;
  phone?: string;
  bio?: string;
}): Promise<UserActionState> => {
  const result = await authFetch<User>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!result) return { success: false, message: "Cannot reach the server." };

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      fieldErrors: toFieldErrors(result),
    };
  }

  revalidateTag("my-profile", "max");

  return { success: true, message: result.message };
};

export const changeMyPassword = async (payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<UserActionState> => {
  const result = await authFetch<unknown>("/api/users/me/password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!result) return { success: false, message: "Cannot reach the server." };

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      fieldErrors: toFieldErrors(result),
    };
  }

  return { success: true, message: result.message };
};

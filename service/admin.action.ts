"use server";

import { revalidateTag } from "next/cache";

import type { Category, User } from "@/lib/types";
import { authFetch } from "@/utils/api";

export type AdminActionState = {
  success: boolean;
  message: string;
};

/** ban / unban */
export const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "BANNED"
): Promise<AdminActionState> => {
  const result = await authFetch<User>(`/api/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  if (!result) {
    return { success: false, message: "Cannot reach the server." };
  }

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, message: result.message };
};

const refreshCategories = () => {
  revalidateTag("categories", "max");
  revalidateTag("properties", "max");
};

export const createCategory = async (payload: {
  name: string;
  description?: string;
}): Promise<AdminActionState> => {
  const result = await authFetch<Category>("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!result) return { success: false, message: "Cannot reach the server." };
  if (!result.success) return { success: false, message: result.message };

  refreshCategories();

  return { success: true, message: result.message };
};

export const updateCategory = async (
  categoryId: string,
  payload: { name?: string; description?: string; isActive?: boolean }
): Promise<AdminActionState> => {
  const result = await authFetch<Category>(
    `/api/admin/categories/${categoryId}`,
    { method: "PATCH", body: JSON.stringify(payload) }
  );

  if (!result) return { success: false, message: "Cannot reach the server." };
  if (!result.success) return { success: false, message: result.message };

  refreshCategories();

  return { success: true, message: result.message };
};

export const deleteCategory = async (
  categoryId: string
): Promise<AdminActionState> => {
  const result = await authFetch<unknown>(
    `/api/admin/categories/${categoryId}`,
    { method: "DELETE" }
  );

  if (!result) return { success: false, message: "Cannot reach the server." };
  if (!result.success) return { success: false, message: result.message };

  refreshCategories();

  return { success: true, message: result.message };
};

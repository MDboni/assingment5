import { cookies } from "next/headers";

import type { ApiResult, User } from "@/lib/types";

/**
 * বর্তমান logged-in user — না থাকলে null।
 * শুধু Server Component / Server Action থেকে ডাকবে।
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
      headers: { Cookie: `accessToken=${accessToken}` },
      cache: "no-store",
    });

    const result = (await res.json()) as ApiResult<User>;

    return result.success ? result.data : null;
  } catch {
    // backend বন্ধ থাকলেও navbar যেন crash না করে
    return null;
  }
};

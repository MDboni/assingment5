import { cookies } from "next/headers";

import type { ApiResult, User } from "@/lib/types";

/**
 * The current logged-in user, or null if there is none.
 * Call this only from Server Components / Server Actions.
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
    // Do not let the navbar crash if the backend is down.
    return null;
  }
};

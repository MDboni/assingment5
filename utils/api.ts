import { cookies } from "next/headers";

import type { ApiResult } from "@/lib/types";

/**
 * Call the backend with a token. Use this only from Server Components / Server Actions.
 * If the network fails, return null so the caller can show "server unreachable".
 */
export const authFetch = async <T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T> | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      statusCode: 401,
      message: "You are not signed in.",
    };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
        ...init.headers,
      },
      cache: "no-store",
    });

    return (await res.json()) as ApiResult<T>;
  } catch {
    return null;
  }
};

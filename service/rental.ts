import type { ApiMeta, RentalRequest } from "@/lib/types";
import { authFetch } from "@/utils/api";

export type RentalListResult = {
  rentals: RentalRequest[];
  meta: ApiMeta | null;
  error: string | null;
};

/** GET /api/rentals — tenant-এর নিজের সব request */
export const getMyRentals = async (
  query: { status?: string; page?: string; limit?: string } = {}
): Promise<RentalListResult> => {
  const params = new URLSearchParams(
    Object.entries(query).filter(([, value]) => value) as [string, string][]
  );

  const result = await authFetch<RentalRequest[]>(`/api/rentals?${params}`, {
    next: { tags: ["my-rentals"] },
  } as RequestInit);

  if (!result) {
    return { rentals: [], meta: null, error: "Cannot reach the server." };
  }

  if (!result.success) {
    return { rentals: [], meta: null, error: result.message };
  }

  return { rentals: result.data, meta: result.meta ?? null, error: null };
};

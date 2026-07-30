import type { ApiMeta, Payment } from "@/lib/types";
import { authFetch } from "@/utils/api";

export type PaymentListResult = {
  payments: Payment[];
  meta: ApiMeta | null;
  error: string | null;
};

/** GET /api/payments — নিজের payment history */
export const getMyPayments = async (
  query: { page?: string; limit?: string; status?: string } = {}
): Promise<PaymentListResult> => {
  const params = new URLSearchParams(
    Object.entries(query).filter(([, value]) => value) as [string, string][]
  );

  const result = await authFetch<Payment[]>(`/api/payments?${params}`);

  if (!result) {
    return { payments: [], meta: null, error: "Cannot reach the server." };
  }

  if (!result.success) {
    return { payments: [], meta: null, error: result.message };
  }

  return { payments: result.data, meta: result.meta ?? null, error: null };
};

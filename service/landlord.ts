import type {
  ApiMeta,
  LandlordProperty,
  RentalRequest,
} from "@/lib/types";
import { authFetch } from "@/utils/api";

const buildParams = (query: Record<string, string | undefined>) =>
  new URLSearchParams(
    Object.entries(query).filter(([, value]) => value) as [string, string][]
  );

/** GET /api/landlord/properties */
export const getMyProperties = async (
  query: { status?: string; search?: string; page?: string; limit?: string } = {}
): Promise<{
  properties: LandlordProperty[];
  meta: ApiMeta | null;
  error: string | null;
}> => {
  const result = await authFetch<LandlordProperty[]>(
    `/api/landlord/properties?${buildParams(query)}`
  );

  if (!result) {
    return { properties: [], meta: null, error: "Cannot reach the server." };
  }

  if (!result.success) {
    return { properties: [], meta: null, error: result.message };
  }

  return { properties: result.data, meta: result.meta ?? null, error: null };
};

/** GET /api/landlord/requests */
export const getLandlordRequests = async (
  query: { status?: string; propertyId?: string; page?: string; limit?: string } = {}
): Promise<{
  requests: RentalRequest[];
  meta: ApiMeta | null;
  error: string | null;
}> => {
  const result = await authFetch<RentalRequest[]>(
    `/api/landlord/requests?${buildParams(query)}`
  );

  if (!result) {
    return { requests: [], meta: null, error: "Cannot reach the server." };
  }

  if (!result.success) {
    return { requests: [], meta: null, error: result.message };
  }

  return { requests: result.data, meta: result.meta ?? null, error: null };
};

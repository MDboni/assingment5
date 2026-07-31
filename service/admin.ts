import type {
  AdminUser,
  ApiMeta,
  Category,
  Property,
  RentalRequest,
} from "@/lib/types";
import { authFetch } from "@/utils/api";

const buildParams = (query: Record<string, string | undefined>) =>
  new URLSearchParams(
    Object.entries(query).filter(([, value]) => value) as [string, string][]
  );

type ListResult<T> = {
  data: T[];
  meta: ApiMeta | null;
  error: string | null;
};

/** তিনটে admin list-এর গঠন এক, তাই একটাই helper */
const fetchList = async <T>(
  path: string,
  query: Record<string, string | undefined>
): Promise<ListResult<T>> => {
  const result = await authFetch<T[]>(`${path}?${buildParams(query)}`);

  if (!result) {
    return { data: [], meta: null, error: "Cannot reach the server." };
  }

  if (!result.success) {
    return { data: [], meta: null, error: result.message };
  }

  return { data: result.data, meta: result.meta ?? null, error: null };
};

export const getAllUsers = (
  query: {
    search?: string;
    role?: string;
    status?: string;
    page?: string;
    limit?: string;
  } = {}
) => fetchList<AdminUser>("/api/admin/users", query);

export const getAllProperties = (
  query: {
    search?: string;
    status?: string;
    city?: string;
    page?: string;
    limit?: string;
  } = {}
) => fetchList<Property>("/api/admin/properties", query);

export const getAllRentals = (
  query: { status?: string; page?: string; limit?: string } = {}
) => fetchList<RentalRequest>("/api/admin/rentals", query);

export const getAdminCategories = () =>
  fetchList<Category>("/api/admin/categories", {});

import type { ApiMeta, ApiResult, Property } from "@/lib/types";
import type { PropertyDetail } from "@/lib/types";

/** backend যে query param গুলো বোঝে — আমি ওদের interface থেকে হুবহু নিয়েছি */
export type PropertyQuery = {
  search?: string;
  city?: string;
  area?: string;
  categoryId?: string;
  categorySlug?: string;
  bedrooms?: string;
  bathrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  amenity?: string;
  page?: string;
  limit?: string;
  sortBy?: "monthlyRent" | "createdAt" | "bedrooms" | "sizeSqft" | "title";
  sortOrder?: "asc" | "desc";
};

export type PropertyListResult = {
  properties: Property[];
  meta: ApiMeta | null;
  error: string | null;
};

export const getProperties = async (
  query: PropertyQuery = {}
): Promise<PropertyListResult> => {
  // undefined / খালি value গুলো বাদ দাও, নাহলে "?city=" পাঠিয়ে filter ভেঙে যাবে
  const params = new URLSearchParams(
    Object.entries(query).filter(([, value]) => value) as [string, string][]
  );

  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/properties?${params}`,
      {
        // public data — ৬০ সেকেন্ড cache, তারপর background-এ refresh
        next: { revalidate: 60, tags: ["properties"] },
      }
    );

    const result = (await res.json()) as ApiResult<Property[]>;

    if (!result.success) {
      return { properties: [], meta: null, error: result.message };
    }

    return {
      properties: result.data,
      meta: result.meta ?? null,
      error: null,
    };
  } catch {
    return {
      properties: [],
      meta: null,
      error: "Unable to load properties right now.",
    };
  }
};



export const getPropertyById = async (
  id: string
): Promise<{ property: PropertyDetail | null; error: string | null }> => {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/properties/${id}`,
      { next: { revalidate: 60, tags: ["properties", `property-${id}`] } }
    );

    const result = (await res.json()) as ApiResult<PropertyDetail>;

    if (!result.success) {
      return { property: null, error: result.message };
    }

    return { property: result.data, error: null };
  } catch {
    return { property: null, error: "Unable to load this property." };
  }
};

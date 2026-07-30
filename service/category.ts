import type { ApiResult, Category } from "@/lib/types";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
      next: { revalidate: 3600, tags: ["categories"] },
    });

    const result = (await res.json()) as ApiResult<Category[]>;

    return result.success ? result.data : [];
  } catch {
    return [];
  }
};

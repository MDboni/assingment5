import { TagIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

import { CategoryDialog } from "@/components/admin/category-dialog";
import { CategoryRow } from "@/components/admin/category-row";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { getAdminCategories } from "@/service/admin";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const { data: categories, error } = await getAdminCategories();

  const activeCount = categories.filter((category) => category.isActive).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Categories"
        description={
          categories.length > 0
            ? `${activeCount} of ${categories.length} visible to tenants.`
            : "Property types tenants can filter by."
        }
        action={<CategoryDialog />}
      />

      {error ? (
        <ErrorState message={error} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={TagIcon}
          title="No categories yet"
          description="Add your first category so landlords can classify their listings."
        />
      ) : (
        <ul className="divide-y divide-border border border-border">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </ul>
      )}
    </div>
  );
}

import type { Metadata } from "next";

import { PageHeader } from "@/components/dashboard/page-header";
import { PropertyForm } from "@/components/landlord/property-form";
import { getCategories } from "@/service/category";

export const metadata: Metadata = { title: "Add property" };

export default async function NewPropertyPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Landlord"
        title="Add a property"
        description="Fill in the details below. You can edit everything later."
      />

      <PropertyForm categories={categories} />
    </div>
  );
}

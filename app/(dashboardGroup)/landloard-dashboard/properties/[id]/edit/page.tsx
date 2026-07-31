import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { PropertyForm } from "@/components/landlord/property-form";
import { getCategories } from "@/service/category";
import { getMyProperties } from "@/service/landlord";

export const metadata: Metadata = { title: "Edit property" };

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [categories, propertyResult] = await Promise.all([
    getCategories(),
    getMyProperties({ limit: "100" }),
  ]);

  // নিজের তালিকা থেকেই খুঁজছি — public endpoint ARCHIVED property দেয় না,
  // আর অন্যের property edit করার সুযোগও এভাবে বন্ধ থাকে
  const property = propertyResult.properties.find((item) => item.id === id);

  if (!property) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Landlord"
        title="Edit property"
        description={property.title}
      />

      <PropertyForm categories={categories} property={property} />
    </div>
  );
}

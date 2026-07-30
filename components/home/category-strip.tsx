import Link from "next/link";

import { getCategories } from "@/service/category";

export async function CategoryStrip() {
  const categories = await getCategories();

  if (!categories.length) return null;

  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto flex w-full max-w-7xl gap-3 overflow-x-auto px-5 py-4 lg:px-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/properties?categorySlug=${category.slug}`}
            className="group flex shrink-0 items-center gap-2 border border-border bg-background px-3 py-2 transition-colors hover:border-primary/50"
          >
            <span className="text-[11px] transition-colors group-hover:text-primary">
              {category.name}
            </span>

            <span className="border border-border px-1.5 text-[9px] text-muted-foreground">
              {category.propertyCount ?? 0}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

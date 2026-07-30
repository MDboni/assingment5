import {
  BathtubIcon,
  BedIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  RulerIcon,
  StarIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PropertyGallery } from "@/components/property/property-gallery";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/format";
import { getPropertyById } from "@/service/property";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const { property } = await getPropertyById(id);

  if (!property) return { title: "Property not found" };

  return {
    title: property.title,
    description:
      property.description ??
      `${property.bedrooms} bedroom rental in ${property.area}, ${property.city}.`,
    openGraph: { images: property.images?.[0] ? [property.images[0]] : [] },
  };
}

export default async function PropertyDetailsPage({ params }: Params) {
  const { id } = await params;
  const { property } = await getPropertyById(id);

  // backend 404 দিলে Next.js-এর not-found.tsx দেখাও
  if (!property) notFound();

  const specs = [
    { icon: BedIcon, label: "Bedrooms", value: property.bedrooms },
    { icon: BathtubIcon, label: "Bathrooms", value: property.bathrooms },
    { icon: RulerIcon, label: "Size", value: `${property.sizeSqft} sqft` },
    {
      icon: CalendarBlankIcon,
      label: "Available",
      value: property.availableFrom
        ? formatDate(property.availableFrom)
        : "Now",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
      {/* ── breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/properties"
          className="transition-colors hover:text-foreground"
        >
          Properties
        </Link>
        <span>/</span>
        <span className="line-clamp-1 text-foreground">{property.title}</span>
      </nav>

      <div className="mt-6 lg:grid lg:grid-cols-[1.6fr_1fr] lg:gap-10">
        {/* ══ বাঁ পাশ ══ */}
        <div>
          <PropertyGallery images={property.images} title={property.title} />

          {/* ── শিরোনাম ── */}
          <div className="mt-8 border-b border-border pb-6">
            <div className="flex flex-wrap items-center gap-2">
              {property.category && (
                <span className="border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-primary">
                  {property.category.name}
                </span>
              )}

              {property.ratingSummary.total > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <StarIcon weight="fill" className="size-3 text-primary" />
                  {property.ratingSummary.average} ({property.ratingSummary.total}{" "}
                  reviews)
                </span>
              )}
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {property.title}
            </h1>

            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPinIcon className="size-3.5" />
              {property.address}, {property.area}, {property.city}
            </p>
          </div>

          {/* ── স্পেক ── */}
          <div className="mt-6 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label} className="bg-background p-4">
                <spec.icon className="size-4 text-primary" />
                <p className="mt-2.5 text-sm font-medium">{spec.value}</p>
                <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                  {spec.label}
                </p>
              </div>
            ))}
          </div>

          {/* ── বর্ণনা ── */}
          {property.description && (
            <section className="mt-10">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                About this property
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {property.description}
              </p>
            </section>
          )}

          {/* ── সুবিধা ── */}
          {property.amenities.length > 0 && (
            <section className="mt-10">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Amenities
              </h2>

              <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="inline-flex items-center gap-1.5 text-[11px] capitalize"
                  >
                    <CheckCircleIcon
                      weight="fill"
                      className="size-3.5 shrink-0 text-primary"
                    />
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── রিভিউ ── */}
          <section className="mt-10">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Reviews ({property.ratingSummary.total})
            </h2>

            {property.reviews.length === 0 ? (
              <p className="mt-3 border border-dashed border-border p-6 text-center text-[11px] text-muted-foreground">
                No reviews yet — be the first tenant to review this place.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {property.reviews.map((review) => (
                  <li key={review.id} className="border border-border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">
                        {review.tenant?.name ?? "Tenant"}
                      </p>

                      <span className="inline-flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <StarIcon
                            key={index}
                            weight="fill"
                            className={
                              index < review.rating
                                ? "size-3 text-primary"
                                : "size-3 text-muted-foreground/30"
                            }
                          />
                        ))}
                      </span>
                    </div>

                    {review.comment && (
                      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                        {review.comment}
                      </p>
                    )}

                    <p className="mt-2 text-[9px] text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ══ ডান পাশ: sticky booking card ══ */}
        <aside className="mt-10 lg:mt-0">
          <div className="sticky top-20 space-y-4">
            <div className="border border-border bg-card p-6">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                Monthly rent
              </p>

              <p className="mt-1 text-2xl font-semibold text-primary">
                {formatCurrency(property.monthlyRent)}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-[11px]">
                <span className="text-muted-foreground">Security deposit</span>
                <span className="font-medium">
                  {formatCurrency(property.securityDeposit)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Status</span>
                <span className="border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-primary">
                  {property.status}
                </span>
              </div>

              {/* পরের ধাপে এটাই আসল dialog হবে */}
              <Button size="lg" className="mt-6 w-full" disabled>
                Request to rent
              </Button>

              <p className="mt-2.5 text-center text-[10px] text-muted-foreground">
                No charge until the landlord approves.
              </p>
            </div>

            {/* ── landlord ── */}
            {property.landlord && (
              <div className="border border-border p-5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  Listed by
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center border border-border bg-muted">
                    <UserIcon className="size-4 text-muted-foreground" />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">
                      {property.landlord.name}
                    </p>

                    {property.landlord.phone && (
                      <p className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <PhoneIcon className="size-3" />
                        {property.landlord.phone}
                      </p>
                    )}
                  </div>
                </div>

                {property.landlord.bio && (
                  <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
                    {property.landlord.bio}
                  </p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

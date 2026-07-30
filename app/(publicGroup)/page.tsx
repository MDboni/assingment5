import { Suspense } from "react";

import { CategoryStrip } from "@/components/home/category-strip";
import { CtaBanner } from "@/components/home/cta-banner";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PropertyGridSkeleton } from "@/components/property/property-card-skeleton";
import { SectionHeading } from "@/components/shared/section-heading";

export default function HomePage() {
  return (
    <>
      <Hero />

      <Suspense fallback={<div className="h-[57px] border-b border-border" />}>
        <CategoryStrip />
      </Suspense>

      {/* ── Featured ── */}
      <section className="mx-auto w-full max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Fresh on RentNest"
          title="Latest listings"
          description="Newly added rentals from verified landlords across Bangladesh."
          action={{ href: "/properties", label: "View all properties" }}
        />

        <div className="mt-10">
          <Suspense fallback={<PropertyGridSkeleton count={6} />}>
            <FeaturedProperties />
          </Suspense>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps to your next home"
          />

          <div className="mt-10">
            <HowItWorks />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto w-full max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <CtaBanner />
      </section>
    </>
  );
}

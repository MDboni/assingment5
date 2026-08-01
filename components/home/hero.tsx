import { MagnifyingGlassIcon, SealCheckIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const CITIES = ["Dhaka", "Chattogram", "Sylhet"];

const STATS = [
  { value: "15+", label: "Live listings" },
  { value: "3", label: "Cities" },
  { value: "৳9k+", label: "From / month" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* blueprint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Green glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[32rem] rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-5 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        {/* ══ Left side ══ */}
        <div>
          <span className="inline-flex items-center gap-1.5 border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-primary">
            <SealCheckIcon weight="fill" className="size-3" />
            Verified rentals only
          </span>

          <h1 className="mt-6 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Find your next home
            <span className="block text-primary">without the hassle.</span>
          </h1>

          <p className="mt-5 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Browse verified rentals across Bangladesh, send a rental request in
            seconds, and pay securely online — all in one place.
          </p>

          {/* ── Search (works without JS) ── */}
          <form
            action="/properties"
            className="mt-8 flex flex-col gap-2 sm:flex-row"
          >
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                name="search"
                placeholder="Search by area, city or title…"
                aria-label="Search properties"
                className="h-11 w-full border border-input bg-background pl-9 pr-3 text-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
              />
            </div>

            <Button type="submit" size="lg" className="h-11 px-6">
              Search
            </Button>
          </form>

          {/* ── City chips ── */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Popular
            </span>

            {CITIES.map((city) => (
              <Link
                key={city}
                href={`/properties?city=${city}`}
                className="border border-border px-2.5 py-1 text-[10px] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                {city}
              </Link>
            ))}
          </div>

          {/* ── Stats ── */}
          <dl className="mt-10 flex items-center gap-8 border-t border-border pt-6">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-lg font-semibold text-primary">
                  {stat.value}
                </dd>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </div>

        {/* ══ Right side: image collage ══ */}
        <div className="hero-collage relative hidden lg:block hero-collage-enter">
          <div className="relative aspect-[4/5] overflow-hidden border border-border">
            <Image
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80"
              alt="Modern two-storey house available for rent"
              fill
              priority
              sizes="(max-width: 1024px) 0px, 40vw"
              className="hero-main-image object-cover"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.02)_100%)]"
            />
          </div>

          {/* Floating thumbnail */}
          <div className="hero-thumbnail absolute -bottom-8 -left-10 aspect-[4/3] w-52 border border-border bg-background shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80"
              alt="Furnished living room of a rental apartment"
              fill
              sizes="208px"
              className="object-cover"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 border border-white/10"
            />
          </div>

          {/* Floating info card */}
          <div className="absolute -right-6 top-10 border border-border bg-background/95 p-3 shadow-xl backdrop-blur-sm">
            <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
              Avg. response
            </p>
            <p className="mt-1 text-sm font-semibold text-primary">
              under 2 hours
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}

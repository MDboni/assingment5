import { ArrowLeftIcon, SealCheckIcon, ShieldCheckIcon, LightningIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { Brand } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const HIGHLIGHTS = [
  {
    icon: SealCheckIcon,
    title: "Verified listings",
    body: "Every property is reviewed before it goes live.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure payments",
    body: "Stripe-backed checkout with instant receipts.",
  },
  {
    icon: LightningIcon,
    title: "Instant requests",
    body: "Send a rental request and track it in real time.",
  },
];

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* ══ বাঁ পাশ: brand panel (mobile-এ লুকানো) ══ */}
      <aside className="relative hidden overflow-hidden border-r border-border bg-primary/5 lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* সূক্ষ্ম grid pattern — blueprint feel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* কোণা থেকে আলো */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-primary/20 blur-3xl"
        />

        <div className="relative">
          <Brand />
        </div>

        <div className="relative max-w-md">
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary">
            Rental marketplace
          </p>

          <h2 className="mt-4 text-3xl leading-tight font-semibold tracking-tight">
            Find your next home, <br />
            or fill your next vacancy.
          </h2>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            RentNest connects tenants and landlords with verified listings,
            transparent pricing, and secure online payments.
          </p>

          <ul className="mt-10 space-y-5">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center border border-primary/30 bg-primary/10 text-primary">
                  <item.icon weight="bold" className="size-3.5" />
                </span>

                <div>
                  <p className="text-xs font-medium">{item.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-6 border-t border-border pt-6">
          {[
            { value: "1.2k+", label: "Listings" },
            { value: "800+", label: "Tenants" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-sm font-semibold text-primary">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* ══ ডান পাশ: form ══ */}
      <main className="flex flex-col">
        <header className="flex items-center justify-between border-b border-border px-5 py-4 lg:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to home
          </Link>

          <div className="flex items-center gap-2">
            <span className="lg:hidden">
              <Brand />
            </span>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-12 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";

import { Brand } from "@/components/shared/brand";

const FOOTER_SECTIONS = [
  {
    title: "Explore",
    links: [
      { href: "/properties", label: "All properties" },
      { href: "/properties?city=Dhaka", label: "Rentals in Dhaka" },
      { href: "/about", label: "About us" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/register", label: "Create account" },
      { href: "/register", label: "List your property" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Brand />

            <p className="mt-4 max-w-xs text-[11px] leading-relaxed text-muted-foreground">
              RentNest connects tenants with verified landlords — browse
              listings, send rental requests, and pay securely online.
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {section.title}
              </p>

              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[11px] text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} RentNest. All rights reserved.
          </p>

          <p className="text-[10px] text-muted-foreground">
            Built with Next.js · Assignment 5
            
          </p>
          <p className="text-[10px] text-muted-foreground">
            powered by : MD Boni Amin Jayed(Software Engineer)
          </p>
        </div>
      </div>
    </footer>
  );
}

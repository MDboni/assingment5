import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Suspense } from "react";

import { Brand } from "@/components/shared/brand";
import { NavLinks } from "@/components/shared/nav-links";
import { NavAuthSkeleton } from "@/components/shared/navbar-skeleton";
import { NavShell } from "@/components/shared/nav-shell";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { NavAuth } from "./nav-auth";

export function Navbar() {
  return (
    <NavShell>
      <div className="mx-auto grid h-14 w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 lg:px-8">
        {/* ── Left ── */}
        <div className="flex items-center gap-8 justify-self-start">
          <Brand />
        </div>

        {/* ── Middle── */}
        <NavLinks className="hidden md:flex justify-self-center" />

        {/* ── Right ── */}
        <div className="flex items-center gap-1.5 justify-self-end">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search properties"
            className="hidden sm:inline-flex"
            render={<Link href="/properties" />}
          >
            <MagnifyingGlassIcon className="size-4" />
          </Button>

          <ThemeToggle />

          <span className="mx-1 hidden h-5 w-px bg-border sm:block" />

          <Suspense fallback={<NavAuthSkeleton />}>
            <NavAuth />
          </Suspense>
        </div>
      </div>
    </NavShell>
  );
}

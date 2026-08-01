"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Keep only the scroll state on the client.
 * The children inside (Brand, NavAuth…) stay Server Components —
 * Server Components can be passed as children to client components.
 */
export function NavShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll(); // Handle the case where the page is already scrolled on refresh.
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "glass border-border shadow-[0_1px_0_0_var(--border)]"
          : "border-transparent bg-background"
      )}
    >
      {children}
    </header>
  );
}

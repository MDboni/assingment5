"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * শুধু scroll state-টুকু client-এ।
 * ভিতরের children (Brand, NavAuth…) Server Component-ই থাকে —
 * Server Component client component-এর children হিসেবে যেতে পারে।
 */
export function NavShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll(); // refresh করলে যদি আগে থেকেই নিচে থাকে
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

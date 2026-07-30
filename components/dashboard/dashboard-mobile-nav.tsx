"use client";

import { ListIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { UserRole } from "@/lib/types";

export function DashboardMobileNav({ role }: { role: UserRole }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
        className="lg:hidden"
      >
        <ListIcon className="size-4" />
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="text-sm">Dashboard</SheetTitle>
        </SheetHeader>

        <div className="p-4">
          {/* link চাপলেই drawer বন্ধ */}
          <DashboardSidebar role={role} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

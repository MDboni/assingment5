"use client";

import { SpinnerIcon, TrashIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { CategoryDialog } from "@/components/admin/category-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { deleteCategory, updateCategory } from "@/service/admin.action";

export function CategoryRow({ category }: { category: Category }) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);

    const result = await updateCategory(category.id, {
      isActive: !category.isActive,
    });

    setIsToggling(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(
      category.isActive
        ? `${category.name} hidden from tenants.`
        : `${category.name} is live again.`
    );

    router.refresh();
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await deleteCategory(category.id);

    setIsDeleting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    setConfirmOpen(false);
    router.refresh();
  };

  return (
    <li className="flex flex-wrap items-center gap-4 p-3.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium">{category.name}</p>

          <span
            className={cn(
              "border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em]",
              category.isActive
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-muted text-muted-foreground"
            )}
          >
            {category.isActive ? "Active" : "Hidden"}
          </span>
        </div>

        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {category.description || "No description"} ·{" "}
          {category.propertyCount ?? 0} properties
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={isToggling}
          onClick={handleToggle}
        >
          {isToggling ? (
            <SpinnerIcon className="size-3.5 animate-spin" />
          ) : null}
          {category.isActive ? "Hide" : "Show"}
        </Button>

        <CategoryDialog category={category} />

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${category.name}`}
              />
            }
          >
            <TrashIcon className="size-3.5 text-destructive" />
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm">Delete category?</DialogTitle>

              <DialogDescription className="text-[11px] leading-relaxed">
                <span className="text-foreground">{category.name}</span> will be
                removed. If any property still uses it, the server will refuse —
                hide it instead.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setConfirmOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <SpinnerIcon className="size-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Yes, delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </li>
  );
}

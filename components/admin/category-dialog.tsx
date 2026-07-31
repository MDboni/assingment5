"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PencilSimpleIcon, PlusIcon, SpinnerIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Field } from "@/components/shared/form-field";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/schemas/category";
import type { Category } from "@/lib/types";
import { createCategory, updateCategory } from "@/service/admin.action";

export function CategoryDialog({ category }: { category?: Category }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(category);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  // dialog খুললেই সর্বশেষ মান দিয়ে ভরে দাও
  useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? "",
        description: category?.description ?? "",
      });
    }
  }, [open, category, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      ...(values.description ? { description: values.description } : {}),
    };

    const result = isEdit
      ? await updateCategory(category!.id, payload)
      : await createCategory(payload);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Edit ${category!.name}`}
            />
          ) : (
            <Button size="lg" />
          )
        }
      >
        {isEdit ? (
          <PencilSimpleIcon className="size-3.5" />
        ) : (
          <>
            <PlusIcon className="size-4" />
            Add category
          </>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {isEdit ? "Edit category" : "New category"}
          </DialogTitle>

          <DialogDescription className="text-[11px]">
            Categories are what tenants filter by on the browse page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Field
            id="category-name"
            label="Name"
            placeholder="Duplex"
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="space-y-1.5">
            <Label
              htmlFor="category-description"
              className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
            >
              Description (optional)
            </Label>

            <Textarea
              id="category-description"
              rows={3}
              placeholder="Two-storey homes with private entrances"
              aria-invalid={!!errors.description}
              {...register("description")}
            />

            {errors.description && (
              <p className="text-[11px] text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <SpinnerIcon className="size-4 animate-spin" />
                  Saving…
                </>
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Create category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

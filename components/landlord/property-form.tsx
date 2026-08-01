"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, SpinnerIcon, TrashIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Field } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AMENITIES } from "@/lib/constants";
import {
  propertySchema,
  type PropertyFormValues,
} from "@/lib/schemas/property";
import type { Category, LandlordProperty } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  createProperty,
  updateProperty,
  type PropertyPayload,
} from "@/service/landlord.action";

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Available", hint: "Visible to tenants" },
  { value: "UNAVAILABLE", label: "Hidden", hint: "Not shown publicly" },
  { value: "ARCHIVED", label: "Archived", hint: "Retired listing" },
] as const;

export function PropertyForm({
  categories,
  property,
}: {
  categories: Category[];
  /** Edit mode when provided, create mode otherwise. */
  property?: LandlordProperty;
}) {
  const router = useRouter();
  const isEdit = Boolean(property);

  const {
    register,
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title ?? "",
      description: property?.description ?? "",
      categoryId: property?.categoryId ?? "",
      address: property?.address ?? "",
      city: property?.city ?? "",
      area: property?.area ?? "",
      monthlyRent: property ? String(property.monthlyRent) : "",
      securityDeposit: property ? String(property.securityDeposit) : "",
      bedrooms: property ? String(property.bedrooms) : "",
      bathrooms: property ? String(property.bathrooms) : "",
      sizeSqft: property ? String(property.sizeSqft) : "",
      amenities: property?.amenities ?? [],
      images: property?.images?.length
        ? property.images.map((url) => ({ url }))
        : [{ url: "" }],
      availableFrom: property?.availableFrom
        ? property.availableFrom.slice(0, 10)
        : "",
      status:
        property?.status === "RENTED"
          ? "AVAILABLE" // RENTED is not accepted by the backend, so map it.
          : (property?.status ?? "AVAILABLE"),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "images" });

  const imageValues = watch("images");

  const onSubmit = async (values: PropertyFormValues) => {
    const payload: PropertyPayload = {
      title: values.title,
      description: values.description,
      categoryId: values.categoryId,
      address: values.address,
      city: values.city,
      area: values.area,
      // Convert string to number here.
      monthlyRent: Number(values.monthlyRent),
      securityDeposit: Number(values.securityDeposit),
      bedrooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      sizeSqft: Number(values.sizeSqft),
      amenities: values.amenities,
      images: values.images.map((image) => image.url),
      status: values.status,
      ...(values.availableFrom ? { availableFrom: values.availableFrom } : {}),
    };

    const result = isEdit
      ? await updateProperty(property!.id, payload)
      : await createProperty(payload);

    if (!result.success) {
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof PropertyFormValues, {
            type: "server",
            message,
          });
        });
      }

      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    router.push("/landloard-dashboard/properties");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* ══ Basic information ══ */}
      <Section title="Basics">
        <Field
          id="title"
          label="Title"
          placeholder="Lake Facing Flat in Dhanmondi"
          error={errors.title?.message}
          {...register("title")}
        />

        <div className="space-y-1.5">
          <Label
            htmlFor="description"
            className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
          >
            Description
          </Label>

          <Textarea
            id="description"
            rows={4}
            placeholder="Describe the property, nearby landmarks, and what makes it special…"
            aria-invalid={!!errors.description}
            {...register("description")}
          />

          {errors.description && (
            <p className="text-[11px] text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* ── property type ── */}
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            Property type
          </Label>

          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => {
                  const isActive = field.value === category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => field.onChange(category.id)}
                      aria-pressed={isActive}
                      className={cn(
                        "border px-3 py-1.5 text-[11px] transition-colors",
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            )}
          />

          {errors.categoryId && (
            <p className="text-[11px] text-destructive">
              {errors.categoryId.message}
            </p>
          )}
        </div>
      </Section>

      {/* ══ Location ══ */}
      <Section title="Location">
        <Field
          id="address"
          label="Street address"
          placeholder="House 30, Road 8/A"
          error={errors.address?.message}
          {...register("address")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="area"
            label="Area"
            placeholder="Dhanmondi"
            error={errors.area?.message}
            {...register("area")}
          />

          <Field
            id="city"
            label="City"
            placeholder="Dhaka"
            error={errors.city?.message}
            {...register("city")}
          />
        </div>
      </Section>

      {/* ══ Pricing and size ══ */}
      <Section title="Pricing & size">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="monthlyRent"
            type="number"
            label="Monthly rent (৳)"
            placeholder="25000"
            error={errors.monthlyRent?.message}
            {...register("monthlyRent")}
          />

          <Field
            id="securityDeposit"
            type="number"
            label="Security deposit (৳)"
            placeholder="50000"
            error={errors.securityDeposit?.message}
            {...register("securityDeposit")}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            id="bedrooms"
            type="number"
            label="Bedrooms"
            placeholder="2"
            error={errors.bedrooms?.message}
            {...register("bedrooms")}
          />

          <Field
            id="bathrooms"
            type="number"
            label="Bathrooms"
            placeholder="2"
            error={errors.bathrooms?.message}
            {...register("bathrooms")}
          />

          <Field
            id="sizeSqft"
            type="number"
            label="Size (sqft)"
            placeholder="1200"
            error={errors.sizeSqft?.message}
            {...register("sizeSqft")}
          />
        </div>

        <Field
          id="availableFrom"
          type="date"
          label="Available from (optional)"
          error={errors.availableFrom?.message}
          {...register("availableFrom")}
        />
      </Section>

      {/* ══ Amenities ══ */}
      <Section title="Amenities">
        <Controller
          control={control}
          name="amenities"
          render={({ field }) => (
            <div className="flex flex-wrap gap-1.5">
              {AMENITIES.map((amenity) => {
                const isActive = field.value.includes(amenity);

                return (
                  <button
                    key={amenity}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() =>
                      field.onChange(
                        isActive
                          ? field.value.filter((item) => item !== amenity)
                          : [...field.value, amenity]
                      )
                    }
                    className={cn(
                      "border px-2.5 py-1 text-[10px] capitalize transition-colors",
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          )}
        />
      </Section>

      {/* ══ Images ══ */}
      <Section title="Images">
        <div className="space-y-3">
          {fields.map((item, index) => {
            const url = imageValues?.[index]?.url;
            const isValidUrl = url?.startsWith("http");

            return (
              <div key={item.id} className="flex items-start gap-2">
                {/* Live preview */}
                <div className="relative size-14 shrink-0 overflow-hidden border border-border bg-muted">
                  {isValidUrl ? (
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-[8px] uppercase text-muted-foreground">
                      {index + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <Input
                    placeholder="https://images.unsplash.com/photo-…"
                    aria-invalid={!!errors.images?.[index]?.url}
                    className="h-9"
                    {...register(`images.${index}.url` as const)}
                  />

                  {errors.images?.[index]?.url && (
                    <p className="mt-1 text-[11px] text-destructive">
                      {errors.images[index]?.url?.message}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove image ${index + 1}`}
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                  className="mt-1"
                >
                  <TrashIcon className="size-3.5 text-destructive" />
                </Button>
              </div>
            );
          })}
        </div>

        {errors.images?.root && (
          <p className="text-[11px] text-destructive">
            {errors.images.root.message}
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ url: "" })}
        >
          <PlusIcon className="size-3.5" />
          Add another image
        </Button>
      </Section>

      {/* ══ Status ══ */}
      <Section title="Visibility">
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <div className="grid gap-2 sm:grid-cols-3">
              {STATUS_OPTIONS.map((option) => {
                const isActive = field.value === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      "border p-3 text-left transition-all",
                      isActive
                        ? "border-primary bg-primary/8 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    )}
                  >
                    <p className="text-xs font-medium">{option.label}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {option.hint}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        />
      </Section>

      {/* ══ Actions ══ */}
      <div className="flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          onClick={() => router.back()}
        >
          Cancel
        </Button>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <SpinnerIcon className="size-4 animate-spin" />
              {isEdit ? "Saving…" : "Creating…"}
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Create property"
          )}
        </Button>
      </div>
    </form>
  );
}

/* ── section wrapper ── */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border border-border bg-card p-5">
      <h2 className="text-[10px] uppercase tracking-[0.2em] text-primary">
        {title}
      </h2>
      {children}
    </section>
  );
}

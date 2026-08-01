"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SpinnerIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Field } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { profileSchema, type ProfileValues } from "@/lib/schemas/profile";
import type { User } from "@/lib/types";
import { updateMyProfile } from "@/service/user.action";

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
      bio: user.bio ?? "",
    },
  });

  const bioLength = watch("bio")?.length ?? 0;

  const onSubmit = async (values: ProfileValues) => {
    const result = await updateMyProfile({
      name: values.name,
      // Sending an empty string would fail the backend's min(6) check.
      ...(values.phone ? { phone: values.phone } : {}),
      ...(values.bio ? { bio: values.bio } : {}),
    });

    if (!result.success) {
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof ProfileValues, { type: "server", message });
        });
      }

      toast.error(result.message);
      return;
    }

    toast.success("Profile updated");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field
        id="name"
        label="Full name"
        error={errors.name?.message}
        {...register("name")}
      />

      {/* Email cannot be changed — the backend does not accept it either. */}
      <div className="space-y-1.5">
        <Label
          htmlFor="email"
          className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
        >
          Email
        </Label>

        <Input id="email" value={user.email} disabled readOnly className="h-9" />

        <p className="text-[10px] text-muted-foreground">
          Email cannot be changed.
        </p>
      </div>

      <Field
        id="phone"
        label="Phone (optional)"
        placeholder="01712345678"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="bio"
            className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
          >
            Bio (optional)
          </Label>

          <span className="text-[9px] text-muted-foreground">
            {bioLength}/1000
          </span>
        </div>

        <Textarea
          id="bio"
          rows={4}
          placeholder="Tell others a bit about yourself…"
          aria-invalid={!!errors.bio}
          {...register("bio")}
        />

        {errors.bio && (
          <p className="text-[11px] text-destructive">{errors.bio.message}</p>
        )}
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" size="lg" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? (
            <>
              <SpinnerIcon className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
}

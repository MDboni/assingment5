"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SpinnerIcon } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Field } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { passwordSchema, type PasswordValues } from "@/lib/schemas/profile";
import { changeMyPassword } from "@/service/user.action";

export function PasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordValues) => {
    const result = await changeMyPassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });

    if (!result.success) {
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof PasswordValues, { type: "server", message });
        });
      }

      toast.error(result.message);
      return;
    }

    toast.success("Password changed successfully");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field
        id="oldPassword"
        type="password"
        label="Current password"
        autoComplete="current-password"
        error={errors.oldPassword?.message}
        {...register("oldPassword")}
      />

      <Field
        id="newPassword"
        type="password"
        label="New password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <Field
        id="confirmPassword"
        type="password"
        label="Confirm new password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <SpinnerIcon className="size-4 animate-spin" />
              Updating…
            </>
          ) : (
            "Change password"
          )}
        </Button>
      </div>
    </form>
  );
}

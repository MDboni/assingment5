"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeSlashIcon, HouseLineIcon, KeyIcon, SpinnerIcon, UserIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterValues } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

import { registerUser } from "../_action/auth";

const ROLE_OPTIONS = [
  {
    value: "TENANT" as const,
    icon: KeyIcon,
    title: "Tenant",
    body: "Browse and rent properties",
  },
  {
    value: "LANDLORD" as const,
    icon: HouseLineIcon,
    title: "Landlord",
    body: "List and manage properties",
  },
];

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "TENANT",
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    const result = await registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
      // Sending an empty string would trip the backend's optional check.
      ...(values.phone ? { phone: values.phone } : {}),
    });

    if (!result.success) {
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof RegisterValues, { type: "server", message });
        });
      }

      toast.error(result.message);
      return;
    }

    toast.success("Account created. Please sign in.");
    router.push("/login");
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Get started
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Already have one?{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* ── Role picker ───────────────────── */}
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            I am a
          </Label>

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {ROLE_OPTIONS.map((option) => {
                  const isActive = field.value === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      aria-pressed={isActive}
                      className={cn(
                        "border p-3 text-left transition-all",
                        isActive
                          ? "border-primary bg-primary/8 ring-1 ring-primary/30"
                          : "border-border hover:border-primary/40 hover:bg-muted/50"
                      )}
                    >
                      <option.icon
                        weight={isActive ? "fill" : "regular"}
                        className={cn(
                          "size-4 transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />

                      <p className="mt-2 text-xs font-medium">{option.title}</p>
                      <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                        {option.body}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          />

          {errors.role && (
            <p className="text-[11px] text-destructive">{errors.role.message}</p>
          )}
        </div>

        {/* ── Name ──────────────────────────── */}
        <Field
          id="name"
          label="Full name"
          placeholder="Rahim Uddin"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

        {/* ── Email ─────────────────────────── */}
        <Field
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* ── Phone (optional) ──────────────── */}
        <Field
          id="phone"
          label="Phone (optional)"
          placeholder="01712345678"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />

        {/* ── Password ──────────────────────── */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
          >
            Password
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={!!errors.password}
              className="h-9 pr-9"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 grid w-9 place-items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? (
                <EyeSlashIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-[11px] text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* ── Confirm password ──────────────── */}
        <Field
          id="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon className="size-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
          By creating an account you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </form>
    </div>
  );
}


/* ─────────────────────────────────────────────
  A reusable label + input + error block to avoid repetition.
  We forward the ref because RHF's register() provides one.
  ───────────────────────────────────────────── */
import { forwardRef, type ComponentProps } from "react";

type FieldProps = ComponentProps<typeof Input> & {
  id: string;
  label: string;
  error?: string;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ id, label, error, ...props }, ref) => (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
      >
        {label}
      </Label>

      <Input
        id={id}
        ref={ref}
        aria-invalid={!!error}
        className="h-9"
        {...props}
      />

      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  )
);

Field.displayName = "Field";

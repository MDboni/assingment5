"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeSlashIcon, SpinnerIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DASHBOARD_PATH } from "@/lib/roles";
import { loginSchema, type LoginValues } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

import { loginUser } from "../_action/auth";

/** Demo/testing helper — fills credentials with one click. */
const DEMO_ACCOUNTS = [
  { label: "Tenant", email: "tenant@rentnest.com", password: "tenant123" },
  { label: "Landlord", email: "landlord@rentnest.com", password: "landlord123" },
  { label: "Admin", email: "admin@rentnest.com", password: "admin123" },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    const result = await loginUser(values);

    if (!result.success) {
      // If the backend returns field-wise errors, show them under the matching inputs.
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof LoginValues, { type: "server", message });
        });
      }

      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    // If the user came from a protected route, send them back there;
    // otherwise go to the role-based dashboard.
    const redirectTo =
      searchParams.get("redirect") ??
      (result.role ? DASHBOARD_PATH[result.role] : "/");

    router.push(redirectTo);
    // The cookies were just set — re-render Server Components like the Navbar.
    router.refresh();
  };

  const fillDemo = (email: string, password: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Welcome back
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Sign in to RentNest
        </h1>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* ── Email ─────────────────────────── */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
          >
            Email
          </Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className="h-9"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-[11px] text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

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
              autoComplete="current-password"
              placeholder="••••••••"
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

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon className="size-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* ── Demo accounts ───────────────────── */}
      <div className="mt-8">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            Demo accounts
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.label}
              type="button"
              onClick={() => fillDemo(account.email, account.password)}
              className={cn(
                "border border-border px-2 py-2 text-[10px] uppercase tracking-[0.12em]",
                "text-muted-foreground transition-colors",
                "hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              )}
            >
              {account.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

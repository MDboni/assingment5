import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "../_components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your RentNest account.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-sm animate-pulse space-y-4">
      <div className="mb-8 space-y-2">
        <div className="h-2 w-20 bg-muted" />
        <div className="h-6 w-48 bg-muted" />
      </div>

      <div className="h-9 bg-muted" />
      <div className="h-9 bg-muted" />
      <div className="h-9 bg-primary/20" />
    </div>
  );
}

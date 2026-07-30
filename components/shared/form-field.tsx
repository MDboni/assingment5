import type { ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldProps = ComponentProps<typeof Input> & {
  id: string;
  label: string;
  error?: string;
};

/**
 * label + input + inline error — একসাথে।
 * React 19-এ ref সাধারণ prop, তাই forwardRef লাগে না;
 * RHF-এর register() যে ref দেয় সেটা ...props দিয়েই পৌঁছে যায়।
 */
export function Field({ id, label, error, className, ...props }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
      >
        {label}
      </Label>

      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn("h-9", className)}
        {...props}
      />

      {error && (
        <p id={`${id}-error`} className="text-[11px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

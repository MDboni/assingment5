import type { Icon } from "@phosphor-icons/react";

export function StatCard({
  label,
  value,
  hint,
  icon: IconComponent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: Icon;
}) {
  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </p>

        <IconComponent className="size-4 text-primary" />
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>

      {hint && (
        <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

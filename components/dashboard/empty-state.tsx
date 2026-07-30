import type { Icon } from "@phosphor-icons/react";

export function EmptyState({
  icon: IconComponent,
  title,
  description,
  action,
}: {
  icon: Icon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-dashed border-border p-12 text-center">
      <span className="mx-auto grid size-10 place-items-center border border-border bg-muted">
        <IconComponent className="size-4 text-muted-foreground" />
      </span>

      <p className="mt-4 text-xs font-medium">{title}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{description}</p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

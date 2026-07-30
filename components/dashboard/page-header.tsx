export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h1>

        {description && (
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

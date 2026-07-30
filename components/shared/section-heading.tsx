import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-lg">
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 border-b border-primary/40 pb-1 text-[11px] text-primary transition-colors hover:border-primary"
        >
          {action.label}
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </div>
  );
}

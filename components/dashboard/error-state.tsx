import { WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="border border-destructive/30 bg-destructive/5 p-10 text-center">
      <WarningCircleIcon className="mx-auto size-5 text-destructive" />

      <p className="mt-3 text-xs font-medium">Something went wrong</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{message}</p>
    </div>
  );
}

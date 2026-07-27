import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shown when a filtered listing returns nothing. Tone matters here — the
 * reader may already be frustrated, so this never blames them and always
 * offers a way forward.
 */
export function EmptyState({
  title = "No results yet",
  description = "Try removing a filter or searching for something broader.",
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-primary"
      >
        <SearchX className="size-5" />
      </span>
      <h2 className="font-heading text-lg font-semibold text-foreground">
        {title}
      </h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

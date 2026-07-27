import { cn } from "@/lib/utils";

/**
 * Small label chip — resource formats, story categories, event types, the
 * Educational Partner badge.
 *
 * Local rather than shadcn's `badge` so the header/card set has no dependency
 * on the component registry. If `badge` is added later this can forward to it.
 */
const TONES = {
  default: "bg-accent text-primary",
  muted: "bg-muted text-muted-foreground",
  script: "bg-script/12 text-script",
  overlay: "bg-background/90 text-primary backdrop-blur-sm",
  new: "bg-success/12 text-success",
} as const;

export type PillTone = keyof typeof TONES;

export function Pill({
  children,
  tone = "default",
  className,
  icon: Icon,
}: {
  children: React.ReactNode;
  tone?: PillTone;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 font-heading text-[0.6875rem] font-semibold tracking-wide uppercase",
        TONES[tone],
        className,
      )}
    >
      {Icon ? <Icon aria-hidden="true" className="size-3" /> : null}
      {children}
    </span>
  );
}

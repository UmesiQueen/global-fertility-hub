import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ScriptAccent } from "@/components/shared/script-accent";
import { cn } from "@/lib/utils";

/**
 * Heading block used by every homepage section and listing page.
 *
 * Takes an explicit heading level so sections can nest correctly — the
 * homepage needs h2 under the hero's h1, while a listing page's first section
 * may need h2 under its own page h1. Hardcoding h2 here would produce a
 * broken outline on at least one of them.
 */
export function SectionHeader({
  title,
  scriptLine,
  description,
  action,
  as: Tag = "h2",
  align = "start",
  className,
  id,
}: {
  title: string;
  scriptLine?: string;
  description?: string;
  action?: { label: string; href: string };
  as?: "h2" | "h3";
  align?: "start" | "center";
  className?: string;
  id?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        centered && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "text-center")}>
        <Tag
          id={id}
          className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
        >
          {title}
        </Tag>

        {scriptLine ? (
          <ScriptAccent className="mt-1 block text-2xl md:text-3xl">
            {scriptLine}
          </ScriptAccent>
        ) : null}

        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md text-sm font-semibold text-primary transition-colors hover:text-primary/80 sm:self-auto"
        >
          {action.label}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}

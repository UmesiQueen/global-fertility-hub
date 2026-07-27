import { Check } from "lucide-react";
import Link from "next/link";
import {
  buildHref,
  type RawSearchParams,
  toggleInList,
} from "@/lib/search-params";
import { cn } from "@/lib/utils";

export interface FormatOption {
  value: string;
  label: string;
  count?: number;
}

/**
 * Multi-select "Filter by Format" list.
 *
 * Rendered as links styled like checkboxes rather than real inputs, so the
 * whole thing works without JavaScript and each combination is its own URL.
 * `role="group"` plus `aria-checked` keeps the semantics honest for screen
 * readers even though the elements are anchors.
 */
export function FormatFilter({
  heading,
  options,
  selected,
  pathname,
  searchParams,
  paramKey = "format",
  className,
}: {
  heading: string;
  options: FormatOption[];
  selected: string[];
  pathname: string;
  searchParams: RawSearchParams;
  paramKey?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="font-heading text-sm font-semibold text-foreground">
        {heading}
      </h2>

      <ul className="mt-3 flex flex-col gap-0.5">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          const next = toggleInList(selected, option.value);

          return (
            <li key={option.value}>
              <Link
                href={buildHref(pathname, searchParams, {
                  [paramKey]: next.length ? next : null,
                })}
                role="checkbox"
                aria-checked={isSelected}
                className="group flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card",
                  )}
                >
                  {isSelected ? <Check className="size-3" /> : null}
                </span>

                <span className={cn("flex-1", isSelected && "text-foreground")}>
                  {option.label}
                </span>

                {option.count !== undefined ? (
                  <span className="text-xs tabular-nums">{option.count}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

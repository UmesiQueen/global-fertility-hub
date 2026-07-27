import Link from "next/link";
import { buildHref, type RawSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

export interface ChipOption {
  value: string;
  label: string;
  count?: number;
}

/**
 * Horizontal chip row — story categories, event types, resource tabs.
 *
 * Links, not buttons: a filtered view is a distinct URL, so it should be
 * openable in a new tab and reachable by crawlers. Overflows to a horizontal
 * scroll on narrow screens rather than wrapping to three ragged rows.
 */
export function FilterChips({
  label,
  options,
  active,
  pathname,
  searchParams,
  paramKey,
  allLabel = "All",
  className,
}: {
  label: string;
  options: ChipOption[];
  active?: string;
  pathname: string;
  searchParams: RawSearchParams;
  paramKey: string;
  allLabel?: string;
  className?: string;
}) {
  const chipClass = (isActive: boolean) =>
    cn(
      "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
      isActive
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
    );

  return (
    <nav aria-label={label} className={className}>
      <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <li>
          <Link
            href={buildHref(pathname, searchParams, { [paramKey]: null })}
            aria-current={!active ? "true" : undefined}
            className={chipClass(!active)}
          >
            {allLabel}
          </Link>
        </li>

        {options.map((option) => {
          const isActive = active === option.value;
          return (
            <li key={option.value}>
              <Link
                href={buildHref(pathname, searchParams, {
                  [paramKey]: isActive ? null : option.value,
                })}
                aria-current={isActive ? "true" : undefined}
                className={chipClass(isActive)}
              >
                {option.label}
                {option.count !== undefined ? (
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      isActive
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground",
                    )}
                  >
                    {option.count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

import { X } from "lucide-react";
import Link from "next/link";
import { buildHref, type RawSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

export interface ActiveFilter {
  /** Query key this chip removes. */
  key: string;
  /** For multi-value params, the single value to strip. */
  value?: string;
  label: string;
}

/**
 * Removable chips for what's currently applied, plus "Clear all".
 *
 * Worth the extra component: with five dropdowns on the partners page it is
 * easy to end up with two results and no idea which filter caused it. Showing
 * the applied set — each individually removable — is the difference between
 * "no results" reading as broken or as explainable.
 */
export function ActiveFilters({
  filters,
  pathname,
  searchParams,
  className,
}: {
  filters: ActiveFilter[];
  pathname: string;
  searchParams: RawSearchParams;
  className?: string;
}) {
  if (!filters.length) return null;

  /** Removes one value from a multi-value param, or the whole key. */
  function hrefWithout(filter: ActiveFilter): string {
    if (!filter.value) {
      return buildHref(pathname, searchParams, { [filter.key]: null });
    }

    const raw = searchParams[filter.key];
    const current = (Array.isArray(raw) ? raw : [raw ?? ""])
      .flatMap((part) => part.split(","))
      .map((part) => part.trim())
      .filter(Boolean);

    const next = current.filter((item) => item !== filter.value);
    return buildHref(pathname, searchParams, {
      [filter.key]: next.length ? next : null,
    });
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-xs font-medium text-muted-foreground">
        Filtered by
      </span>

      <ul className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <li key={`${filter.key}:${filter.value ?? ""}`}>
            <Link
              href={hrefWithout(filter)}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-accent px-2.5 text-xs font-medium text-primary transition-colors hover:bg-accent/70"
            >
              {filter.label}
              <X aria-hidden="true" className="size-3.5" />
              <span className="sr-only">Remove filter</span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={pathname}
        className="ml-1 rounded-md text-xs font-semibold text-primary underline-offset-4 hover:underline"
      >
        Clear all
      </Link>
    </div>
  );
}

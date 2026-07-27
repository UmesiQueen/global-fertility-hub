import Link from "next/link";
import { buildHref, type RawSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

export interface CategoryOption {
  value: string;
  label: string;
  count?: number;
}

/**
 * "Browse by Category" sidebar on the Resources page.
 *
 * A Server Component made of links — because the filter lives in the URL,
 * changing category needs no client JavaScript at all. Selecting the active
 * category again clears it, which is what people expect from a toggle list.
 */
export function CategorySidebar({
  heading,
  options,
  active,
  pathname,
  searchParams,
  paramKey = "category",
  className,
}: {
  heading: string;
  options: CategoryOption[];
  active?: string;
  pathname: string;
  searchParams: RawSearchParams;
  paramKey?: string;
  className?: string;
}) {
  return (
    <nav aria-label={heading} className={className}>
      <h2 className="font-heading text-sm font-semibold text-foreground">
        {heading}
      </h2>

      <ul className="mt-3 flex flex-col gap-0.5">
        <li>
          <Link
            href={buildHref(pathname, searchParams, { [paramKey]: null })}
            aria-current={!active ? "true" : undefined}
            className={cn(
              "flex min-h-9 items-center justify-between gap-2 rounded-lg px-2.5 text-sm transition-colors",
              !active
                ? "bg-accent font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            All
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
                className={cn(
                  "flex min-h-9 items-center justify-between gap-2 rounded-lg px-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-accent font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span>{option.label}</span>
                {option.count !== undefined ? (
                  <span className="text-xs text-muted-foreground tabular-nums">
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

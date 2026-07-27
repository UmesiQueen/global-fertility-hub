import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { buildHref, type RawSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

/**
 * Link-based pagination — every page is a real, crawlable URL.
 *
 * Long result sets collapse to first / current window / last with ellipses,
 * so the control stays one line on a phone rather than wrapping to three.
 */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < total) pages.add(current + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const output: (number | "gap")[] = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) output.push("gap");
    output.push(page);
  });

  return output;
}

export function Pagination({
  page,
  totalPages,
  pathname,
  searchParams,
  className,
}: {
  page: number;
  totalPages: number;
  pathname: string;
  searchParams: RawSearchParams;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number) =>
    buildHref(pathname, searchParams, {
      page: target === 1 ? null : String(target),
    });

  const itemClass =
    "inline-flex size-10 items-center justify-center rounded-lg text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className={cn("flex justify-center", className)}>
      <ul className="flex items-center gap-1">
        <li>
          {page > 1 ? (
            <Link
              href={href(page - 1)}
              rel="prev"
              aria-label="Previous page"
              className={cn(
                itemClass,
                "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className={cn(itemClass, "text-muted-foreground/40")}
            >
              <ChevronLeft className="size-4" />
            </span>
          )}
        </li>

        {pageWindow(page, totalPages).map((entry, index) =>
          entry === "gap" ? (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: gaps have no stable identity
              key={`gap-${index}`}
              aria-hidden="true"
              className="px-1 text-sm text-muted-foreground"
            >
              …
            </li>
          ) : (
            <li key={entry}>
              <Link
                href={href(entry)}
                aria-current={entry === page ? "page" : undefined}
                aria-label={`Page ${entry}`}
                className={cn(
                  itemClass,
                  entry === page
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {entry}
              </Link>
            </li>
          ),
        )}

        <li>
          {page < totalPages ? (
            <Link
              href={href(page + 1)}
              rel="next"
              aria-label="Next page"
              className={cn(
                itemClass,
                "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className={cn(itemClass, "text-muted-foreground/40")}
            >
              <ChevronRight className="size-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

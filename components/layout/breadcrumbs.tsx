import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumb trail for detail pages.
 *
 * The final crumb is plain text with `aria-current="page"` rather than a link
 * to the current URL — a link that goes nowhere is a small but real
 * annoyance for screen reader and keyboard users.
 *
 * The matching BreadcrumbList JSON-LD is emitted separately by lib/seo.
 */
export function Breadcrumbs({
  crumbs,
  className,
}: {
  crumbs: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={crumb.label} className="flex items-center gap-1">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="rounded-sm transition-colors hover:text-primary"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(isLast && "text-foreground")}
                >
                  {crumb.label}
                </span>
              )}

              {!isLast ? (
                <ChevronRight aria-hidden="true" className="size-3 shrink-0" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

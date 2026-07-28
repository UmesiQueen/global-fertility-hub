import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

/**
 * The related-content rail used on all four detail page types.
 *
 * Takes children rather than a generic item list: the four card components
 * have genuinely different props, and a `renderItem` generic would buy type
 * gymnastics without removing any real duplication. The value here is the
 * consistent heading, spacing and grid.
 *
 * Renders nothing when empty — a detail page with two related resources and
 * no related events should show one rail, not one rail and an empty heading.
 */
export function RelatedGrid({
  title,
  description,
  action,
  children,
  count,
  columns = 3,
  className,
  headingId,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
  /** Caller passes the item count so the rail can self-suppress. */
  count: number;
  columns?: 2 | 3;
  className?: string;
  headingId: string;
}) {
  if (count === 0) return null;

  return (
    <section aria-labelledby={headingId} className={cn("py-12", className)}>
      <Container>
        <SectionHeader
          id={headingId}
          title={title}
          description={description}
          action={action}
        />
        <ul
          className={cn(
            "mt-8 grid gap-5 sm:grid-cols-2",
            columns === 3 && "lg:grid-cols-3",
          )}
        >
          {children}
        </ul>
      </Container>
    </section>
  );
}

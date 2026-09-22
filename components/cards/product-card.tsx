import {
  BookOpen,
  Headphones,
  Layers,
  NotebookPen,
  Package,
  Play,
} from "lucide-react";
import Link from "next/link";
import { EntityImage } from "@/components/shared/entity-image";
import { Pill } from "@/components/shared/pill";
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product, ProductFormat } from "@/types";

const FORMAT_ICONS: Record<
  ProductFormat,
  React.ComponentType<{ className?: string }>
> = {
  ebook: BookOpen,
  guide: BookOpen,
  workbook: NotebookPen,
  course: Play,
  audio: Headphones,
  bundle: Layers,
  physical: Package,
};

/** "AUD $24", "Free", or nothing when the retailer sets the price. */
export function productPriceLabel(product: Product): string | null {
  if (product.isFree) return "Free";
  if (product.price === undefined) return null;
  return `${product.currency?.toUpperCase() ?? "AUD"} $${product.price}`;
}

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const FormatIcon = FORMAT_ICONS[product.format];
  const price = productPriceLabel(product);
  const isAffiliate = product.source === "affiliate";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow shadow-sm hover:shadow-lg hover:shadow-primary/8",
        className,
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <EntityImage
          image={product.coverImage}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <Pill
          tone="overlay"
          icon={FormatIcon}
          className="absolute top-3 left-3"
        >
          {titleCase(product.format)}
        </Pill>

        {product.isNew ? (
          <Pill tone="new" className="absolute top-3 right-3">
            New
          </Pill>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.6875rem] font-medium tracking-wide text-muted-foreground uppercase">
          {isAffiliate ? `By ${product.vendor}` : "By Henry & Precious"}
        </p>

        <h3 className="mt-1 font-heading text-base leading-snug font-semibold text-foreground">
          <Link
            href={`/store/${product.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
          {price ? (
            <span
              className={cn(
                "font-heading text-sm font-bold",
                product.isFree ? "text-success" : "text-primary",
              )}
            >
              {price}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Price at {product.vendor}
            </span>
          )}

          {isAffiliate ? (
            <span className="text-[0.625rem] text-muted-foreground">
              Affiliate link
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

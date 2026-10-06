import { matches, paginate } from "@/lib/repositories/shared";
import type {
  Paginated,
  Product,
  ProductCategory,
  ProductSource,
} from "@/types";

/**
 * Store filtering, sorting and pagination as a pure function.
 *
 * Pure so it can run in the browser: /store is prerendered with the full
 * catalogue, and the listing applies the URL's filters client-side. The
 * repository calls the same function, so server and browser can never
 * disagree about what a filter means.
 */

export interface ProductQuery {
  search?: string;
  category?: ProductCategory;
  source?: ProductSource;
  sort?: "newest" | "price-low" | "price-high";
  page?: number;
  pageSize?: number;
}

export const byNewestProduct = (a: Product, b: Product) =>
  b.publishedAt.localeCompare(a.publishedAt);

/**
 * Free counts as zero, and affiliate products have no price we control.
 * Sorting those to the end keeps "cheapest first" meaningful rather than
 * filling the top of the list with items that have no price at all.
 */
function priceFor(product: Product): number | null {
  if (product.isFree) return 0;
  return product.price ?? null;
}

export function queryProducts(
  all: Product[],
  query: ProductQuery = {},
): Paginated<Product> {
  const {
    search,
    category,
    source,
    sort = "newest",
    page = 1,
    pageSize = 12,
  } = query;

  let items = [...all];

  if (category) items = items.filter((item) => item.category === category);
  if (source) items = items.filter((item) => item.source === source);

  if (search) {
    items = items.filter(
      (item) =>
        matches(item.name, search) ||
        matches(item.excerpt, search) ||
        matches(item.vendor, search),
    );
  }

  if (sort === "price-low" || sort === "price-high") {
    const direction = sort === "price-low" ? 1 : -1;
    items.sort((a, b) => {
      const priceA = priceFor(a);
      const priceB = priceFor(b);
      if (priceA === null && priceB === null) return byNewestProduct(a, b);
      if (priceA === null) return 1;
      if (priceB === null) return -1;
      return (priceA - priceB) * direction;
    });
  } else {
    items.sort(byNewestProduct);
  }

  return paginate(items, page, pageSize);
}

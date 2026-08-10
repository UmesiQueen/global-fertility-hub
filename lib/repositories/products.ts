import { products } from "@/lib/data/products";
import { resources } from "@/lib/data/resources";
import { findRelated } from "@/lib/relations";
import type {
  Paginated,
  Product,
  ProductCategory,
  ProductSource,
  Resource,
} from "@/types";
import { featuredFirst, matches, paginate } from "./shared";

/** The only supported way for a page to read store products. */

export interface ProductQuery {
  search?: string;
  category?: ProductCategory;
  source?: ProductSource;
  sort?: "newest" | "price-low" | "price-high";
  page?: number;
  pageSize?: number;
}

const byNewest = (a: Product, b: Product) =>
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

export async function getProducts(
  query: ProductQuery = {},
): Promise<Paginated<Product>> {
  const {
    search,
    category,
    source,
    sort = "newest",
    page = 1,
    pageSize = 12,
  } = query;

  let items = [...products];

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
      if (priceA === null && priceB === null) return byNewest(a, b);
      if (priceA === null) return 1;
      if (priceB === null) return -1;
      return (priceA - priceB) * direction;
    });
  } else {
    items.sort(byNewest);
  }

  return paginate(items, page, pageSize);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((item) => item.slug === slug) ?? null;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return featuredFirst(
    products,
    (item) => Boolean(item.isFeatured),
    byNewest,
    limit,
  );
}

export async function getAllProductSlugs(): Promise<string[]> {
  return products.map((item) => item.slug);
}

export async function getProductCategoryCounts(): Promise<
  Record<string, number>
> {
  return products.reduce<Record<string, number>>((counts, item) => {
    counts[item.category] = (counts[item.category] ?? 0) + 1;
    return counts;
  }, {});
}

export async function getProductSourceCounts(): Promise<
  Record<ProductSource, number>
> {
  return products.reduce(
    (counts, item) => {
      counts[item.source] = (counts[item.source] ?? 0) + 1;
      return counts;
    },
    { own: 0, affiliate: 0 } as Record<ProductSource, number>,
  );
}

export async function getRelatedProducts(
  product: Product,
  limit = 3,
): Promise<Product[]> {
  return findRelated(product, products, limit);
}

/**
 * Free reading on the same topic.
 *
 * Deliberately surfaced on every product page: someone shouldn't have to buy
 * something to get help from this site, and pointing at the free version of
 * the same subject is the honest thing to do.
 */
export async function getRelatedResourcesForProduct(
  product: Product,
  limit = 3,
): Promise<Resource[]> {
  return findRelated(product, resources, limit);
}

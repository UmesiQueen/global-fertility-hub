import { fetchProducts } from "@/api/products";
import { fetchResources } from "@/api/resources";
import {
  byNewestProduct as byNewest,
  type ProductQuery,
  queryProducts,
} from "@/lib/listing/products";
import { findRelated } from "@/lib/relations";
import type { Paginated, Product, ProductSource, Resource } from "@/types";
import { featuredFirst } from "./shared";

/** The only supported way for a page to read store products. */

export type { ProductQuery };

export async function getProducts(
  query: ProductQuery = {},
): Promise<Paginated<Product>> {
  return queryProducts(await fetchProducts(), query);
}

/** Every product, for listings that filter in the browser. */
export async function getAllProducts(): Promise<Product[]> {
  return fetchProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((item) => item.slug === slug) ?? null;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return featuredFirst(
    await fetchProducts(),
    (item) => Boolean(item.isFeatured),
    byNewest,
    limit,
  );
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await fetchProducts();
  return products.map((item) => item.slug);
}

export async function getProductCategoryCounts(): Promise<
  Record<string, number>
> {
  const products = await fetchProducts();
  return products.reduce<Record<string, number>>((counts, item) => {
    counts[item.category] = (counts[item.category] ?? 0) + 1;
    return counts;
  }, {});
}

export async function getProductSourceCounts(): Promise<
  Record<ProductSource, number>
> {
  const products = await fetchProducts();
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
  return findRelated(product, await fetchProducts(), limit);
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
  return findRelated(product, await fetchResources(), limit);
}

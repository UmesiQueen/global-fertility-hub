import type { Entity, ImageAsset } from "./shared";

/**
 * Store products.
 *
 * EDITORIAL GUARDRAIL — read before adding a product.
 *
 * Nothing sold or recommended here may be presented as a fertility treatment,
 * a cure, or something that improves anyone's chances of conceiving. That is
 * the same line the rest of the site holds, and it matters more here because
 * money is involved: a health claim attached to a paid product is a
 * regulatory problem in every market this site reaches, not just an editorial
 * one.
 *
 * Describe what a thing *is*, not what it will do for someone's fertility.
 * `scripts/verify-data.cjs` scans product copy for claim language and fails
 * the build if it finds any.
 */

/**
 * Who is behind the product.
 *
 * `own`      — Henry & Precious made it. We take the money (elsewhere).
 * `affiliate` — someone else's product we recommend. We may earn a commission,
 *               and that must be disclosed on the card.
 */
export type ProductSource = "own" | "affiliate";

export type ProductFormat =
  | "ebook"
  | "guide"
  | "workbook"
  | "course"
  | "audio"
  | "bundle"
  | "physical";

export const PRODUCT_CATEGORIES = [
  "guides-and-books",
  "planning-and-tracking",
  "nutrition",
  "emotional-wellbeing",
  "for-partners",
  "gifts-and-comfort",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Product extends Entity {
  name: string;
  /** One line for the card. */
  excerpt: string;
  /** Markdown. Rendered on the detail page. */
  body: string;

  source: ProductSource;
  format: ProductFormat;
  category: ProductCategory;

  /**
   * Our own products carry a price. Affiliate ones deliberately don't — a
   * price we don't control goes stale the moment the retailer changes it, and
   * a wrong price is worse than none.
   */
  price?: number;
  currency?: "AUD" | "USD" | "GBP";
  /** Set when the product is free, e.g. a lead-magnet guide. */
  isFree?: boolean;

  /** Where to actually buy it. Always external — we don't take payment. */
  externalUrl: string;
  /** Who sells it. Shown on affiliate cards so the destination is no surprise. */
  vendor: string;

  coverImage: ImageAsset;
  /** What someone gets: "48-page PDF", "6 audio sessions". */
  includes?: string[];

  publishedAt: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

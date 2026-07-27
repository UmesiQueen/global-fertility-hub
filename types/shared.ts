/**
 * Shared primitives used across every entity.
 *
 * `FertilityTopic` is the single controlled vocabulary that powers
 * cross-entity relatedness (see lib/relations.ts). Every entity carries
 * `tags: FertilityTopic[]` so "related resources / clinics / stories /
 * webinars" can be computed in one place instead of hand-maintained.
 */

export const FERTILITY_TOPICS = [
  "ivf",
  "iui",
  "male-fertility",
  "pcos",
  "endometriosis",
  "pregnancy-loss",
  "donor-conception",
  "lgbtq",
  "fertility-preservation",
  "international-ivf",
  "nutrition",
  "mental-health",
  "success-stories",
] as const;

export type FertilityTopic = (typeof FERTILITY_TOPICS)[number];

/** Human-readable labels for topics. Keep in sync with FERTILITY_TOPICS. */
export const TOPIC_LABELS: Record<FertilityTopic, string> = {
  ivf: "IVF",
  iui: "IUI",
  "male-fertility": "Male Fertility",
  pcos: "PCOS",
  endometriosis: "Endometriosis",
  "pregnancy-loss": "Pregnancy Loss",
  "donor-conception": "Donor Conception",
  lgbtq: "LGBTQ+",
  "fertility-preservation": "Fertility Preservation",
  "international-ivf": "International IVF",
  nutrition: "Nutrition & Lifestyle",
  "mental-health": "Emotional Wellbeing",
  "success-stories": "Success Stories",
};

export interface ImageAsset {
  /**
   * Empty string means "no photo yet" — cards fall back to a themed gradient
   * placeholder rather than a broken image. Real photography fills this in
   * without any component changes.
   */
  src: string;
  /** Always required — this is an accessibility guardrail, not an option. */
  alt: string;
  width?: number;
  height?: number;
}

export interface Author {
  name: string;
  role?: string;
  avatar?: ImageAsset;
}

export interface SeoMeta {
  title?: string;
  description?: string;
  ogImage?: ImageAsset;
}

/** Anything addressable by URL. */
export interface Entity {
  id: string;
  slug: string;
  tags: FertilityTopic[];
  seo?: SeoMeta;
}

/** Shape returned by every paginated listing repository. */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

import type { ImageAsset } from "./shared";

/** Exclusive offers from partner brands (apps, supplements, testing, products). */
export interface Discount {
  id: string;
  brand: string;
  logo: ImageAsset;
  description: string;
  /** e.g. 20 → renders as "20% OFF" */
  percentOff: number;
  code: string;
  redeemUrl: string;
  category?: "app" | "testing" | "supplements" | "products" | "coaching";
}

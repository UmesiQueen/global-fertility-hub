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
  /**
   * True when Global Fertility Hub earns something if this code is used.
   *
   * Disclosure rules in the US (FTC), Australia (ACCC) and the UK (ASA) all
   * require a commercial relationship to be disclosed clearly and close to the
   * link — not buried in a footer. When this is true the card says so.
   *
   * TO CONFIRM with the client, per partner. Leaving it undefined means "we
   * don't know", which is why the page carries a blanket disclosure too.
   */
  isAffiliate?: boolean;
}

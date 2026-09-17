import { hygraphFetch } from "./client";
import { asset } from "./map";
import type { Discount } from "@/types";

const QUERY = `query Discounts($stage: Stage!) {
  discounts(stage: $stage, first: 100) {
    id
    brand
    description
    percentOff
    code
    redeemUrl
    category
    isAffiliate
    logo { url altText }
  }
}`;

export async function fetchDiscounts(): Promise<Discount[]> {
  const data = await hygraphFetch<{ discounts: any[] }>(QUERY);

  return data.discounts.map((d) => ({
    id: d.id,
    brand: d.brand,
    description: d.description ?? "",
    percentOff: d.percentOff ?? 0,
    code: (d.code ?? "").toUpperCase(),
    redeemUrl: d.redeemUrl ?? "",
    category: d.category ?? undefined,
    isAffiliate: d.isAffiliate ?? undefined,
    logo: asset(d.logo, `${d.brand} logo`),
  }));
}

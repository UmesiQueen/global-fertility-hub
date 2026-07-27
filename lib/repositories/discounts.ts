import { discounts } from "@/lib/data/discounts";
import type { Discount } from "@/types";

/** The only supported way for a page to read partner discounts. */

export async function getDiscounts(
  category?: Discount["category"],
): Promise<Discount[]> {
  if (!category) return discounts;
  return discounts.filter((item) => item.category === category);
}

export async function getDiscountById(id: string): Promise<Discount | null> {
  return discounts.find((item) => item.id === id) ?? null;
}

export async function getDiscountCategories(): Promise<
  NonNullable<Discount["category"]>[]
> {
  const categories = new Set<NonNullable<Discount["category"]>>();
  for (const discount of discounts) {
    if (discount.category) categories.add(discount.category);
  }
  return [...categories].sort();
}

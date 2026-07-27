import type { Discount } from "@/types";

/**
 * Mock partner discounts — TEMPORARY. Replaced by the CMS.
 *
 * Brands, codes and percentages here are invented. Publishing an unsigned
 * brand name alongside a discount code is both a legal and a trust problem,
 * so every record must be replaced with confirmed partnership details before
 * this page goes live.
 *
 * Pages must never import this file — go through lib/repositories/discounts.
 */

const img = (alt: string) => ({ src: "", alt });

export const discounts: Discount[] = [
  {
    id: "dis-001",
    brand: "Lumen Cycle",
    logo: img("Lumen Cycle logo"),
    description:
      "An all-in-one fertility companion app with cycle tracking, insights and appointment reminders.",
    percentOff: 20,
    code: "GFHUB20",
    redeemUrl: "https://example.com/lumen-cycle",
    category: "app",
  },
  {
    id: "dis-002",
    brand: "Meridian Labs",
    logo: img("Meridian Labs logo"),
    description:
      "At-home hormone testing that gives you answers and helps you prepare for your next appointment.",
    percentOff: 15,
    code: "GFHUB15",
    redeemUrl: "https://example.com/meridian-labs",
    category: "testing",
  },
  {
    id: "dis-003",
    brand: "Rootwell",
    logo: img("Rootwell logo"),
    description:
      "Evidence-informed supplements formulated for preconception, pregnancy and beyond.",
    percentOff: 10,
    code: "GFHUB10",
    redeemUrl: "https://example.com/rootwell",
    category: "supplements",
  },
  {
    id: "dis-004",
    brand: "Nestle & Bloom",
    logo: img("Nestle & Bloom logo"),
    description:
      "Fertility-friendly products designed to support your natural cycle.",
    percentOff: 15,
    code: "GFHUBLOOM",
    redeemUrl: "https://example.com/nestle-bloom",
    category: "products",
  },
  {
    id: "dis-005",
    brand: "Steady Ground Coaching",
    logo: img("Steady Ground Coaching logo"),
    description:
      "One-to-one coaching for the emotional side of treatment, from coaches who specialise in fertility.",
    percentOff: 10,
    code: "GFHUBSTEADY",
    redeemUrl: "https://example.com/steady-ground",
    category: "coaching",
  },
];

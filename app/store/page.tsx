import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchBar } from "@/components/filters/search-bar";
import { PageHero } from "@/components/layout/page-hero";
import { JsonLd } from "@/components/shared/json-ld";
import { ScriptAccent } from "@/components/shared/script-accent";
import { withoutBody } from "@/lib/listing/trim";
import {
  getAllProducts,
  getProductCategoryCounts,
  getProductSourceCounts,
} from "@/lib/repositories/products";
import { breadcrumbJsonLd } from "@/lib/seo";
import { StoreListing, StoreResults } from "./store-listing";

const PATHNAME = "/store";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Workbooks and audio made by Henry and Precious, plus a few things our community keeps recommending.",
  alternates: { canonical: PATHNAME },
};

const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "Store", href: PATHNAME },
];

export default async function StorePage() {
  const [products, categoryCounts, sourceCounts] = await Promise.all([
    getAllProducts(),
    getProductCategoryCounts(),
    getProductSourceCounts(),
  ]);

  // One object, passed to both: React serialises a shared reference once.
  const listing = {
    products: withoutBody(products),
    categoryCounts,
    sourceCounts,
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(CRUMBS)} />

      <PageHero
        title="The Store"
        scriptLine={<ScriptAccent>Made with you in mind.</ScriptAccent>}
        description="Materials we made ourselves — plus community recommendations."
        image={{
          src: "/store.webp",
          alt: "A fertility journey guide, planning workbooks, headphones and a phone playing a guided meditation, beside a heart mug on a marble table.",
        }}
      >
        <SearchBar
          label="Search the store"
          placeholder="Search products…"
          className="max-w-md"
        />
      </PageHero>

      <Suspense fallback={<StoreResults {...listing} params={{}} />}>
        <StoreListing {...listing} />
      </Suspense>
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchBar } from "@/components/filters/search-bar";
import { PageHero } from "@/components/layout/page-hero";
import { withoutBody } from "@/lib/listing/trim";
import {
  getAllResources,
  getResourceCategoryCounts,
  getResourceFormatCounts,
} from "@/lib/repositories/resources";
import { ResourcesListing, ResourcesResults } from "./resources-listing";

const PATHNAME = "/resources";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Curated fertility topics to help you learn, understand and make informed decisions — articles, videos and downloads.",
  alternates: { canonical: PATHNAME },
};

export default async function ResourcesPage() {
  const [resources, categoryCounts, formatCounts] = await Promise.all([
    getAllResources(),
    getResourceCategoryCounts(),
    getResourceFormatCounts(),
  ]);

  // One object for both, so the shared reference is serialised once.
  const listing = {
    resources: withoutBody(resources),
    categoryCounts,
    formatCounts,
  };

  return (
    <>
      <PageHero
        title="Collections"
        description="Curated fertility topics to help you learn and understand your journey."
        image={{
          src: "/resources.webp",
          alt: "A stack of books, a small vase of greenery and a mug on a sunlit marble table.",
        }}
      >
        <SearchBar
          label="Search collections"
          placeholder="Search collections, topics or keywords…"
          className="max-w-md"
        />
      </PageHero>

      <Suspense fallback={<ResourcesResults {...listing} params={{}} />}>
        <ResourcesListing {...listing} />
      </Suspense>
    </>
  );
}

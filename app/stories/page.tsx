import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { ScriptAccent } from "@/components/shared/script-accent";
import { TrustChips } from "@/components/shared/trust-chips";
import { withoutBody } from "@/lib/listing/trim";
import {
  getAllStories,
  getStoryCategoryCounts,
  STORY_CATEGORIES,
} from "@/lib/repositories/stories";
import { StoriesListing, StoriesResults } from "./stories-listing";

const PATHNAME = "/stories";

export const metadata: Metadata = {
  title: "Community Stories",
  description:
    "Real fertility journeys, shared to inspire, support and remind you that you're not alone. Every story is reviewed before publication.",
  alternates: { canonical: PATHNAME },
};

export default async function StoriesPage() {
  const [stories, counts] = await Promise.all([
    getAllStories(),
    getStoryCategoryCounts(),
  ]);

  // One object for both, so the shared reference is serialised once.
  const listing = {
    stories: withoutBody(stories),
    categories: STORY_CATEGORIES,
    counts,
  };

  return (
    <>
      <PageHero
        title="Community Stories"
        scriptLine={<ScriptAccent>You are not alone.</ScriptAccent>}
        description="Real journeys. Real experiences. Shared to inspire, support and remind you that others understand."
        image={{
          src: "/stories.webp",
          alt: "A framed card reading \u2018Your story could be the hope someone needs today\u2019, beside a heart mug and a vase of gypsophila on a side table.",
        }}
      >
        <TrustChips
          chips={[
            {
              icon: "heart",
              title: "Real people",
              description: "Sharing their honest fertility journeys",
            },
            {
              icon: "shield",
              title: "Safe & respectful",
              description: "All stories are reviewed before publication",
            },
            {
              icon: "globe",
              title: "Hope & connection",
              description: "Your story could be the hope someone needs",
            },
          ]}
        />
      </PageHero>

      <Suspense fallback={<StoriesResults {...listing} params={{}} />}>
        <StoriesListing {...listing} />
      </Suspense>
    </>
  );
}

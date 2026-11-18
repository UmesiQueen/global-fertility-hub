import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { countNewsTypes } from "@/lib/listing/news";
import { withoutBody } from "@/lib/listing/trim";
import { getAllNewsPosts } from "@/lib/repositories/news";
import { NewsListing, NewsResults } from "./news-listing";

const PATHNAME = "/news";

export const metadata: Metadata = {
  title: "News",
  description:
    "Fertility and reproductive health news from Australia and around the world, explained in plain English, plus updates from Global Fertility Hub.",
  alternates: { canonical: PATHNAME },
};

export default async function NewsPage() {
  const posts = await getAllNewsPosts();

  // One object for both, so the shared reference is serialised once.
  const listing = {
    posts: withoutBody(posts),
    counts: countNewsTypes(posts),
  };

  return (
    <>
      <PageHero
        title="News"
        description="Fertility and reproductive health news from Australia and around the world, plus updates from Global Fertility Hub."
        image={{
          src: "/news.webp",
          alt: "A folded newspaper and a pen on a white marble desk, beside a cup of coffee, a small potted plant and a gold globe.",
        }}
      />

      <Suspense fallback={<NewsResults {...listing} params={{}} />}>
        <NewsListing {...listing} />
      </Suspense>
    </>
  );
}

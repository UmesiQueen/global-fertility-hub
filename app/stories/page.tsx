import type { Metadata } from "next";
import { StoryCard } from "@/components/cards/story-card";
import { FilterChips } from "@/components/filters/filter-chips";
import { SearchBar } from "@/components/filters/search-bar";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ScriptAccent } from "@/components/shared/script-accent";
import { TrustChips } from "@/components/shared/trust-chips";
import {
  getStories,
  getStoryCategoryCounts,
  STORY_CATEGORIES,
} from "@/lib/repositories/stories";
import {
  type RawSearchParams,
  readPage,
  readParam,
} from "@/lib/search-params";

const PATHNAME = "/stories";
const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "Community Stories",
  description:
    "Real fertility journeys, shared to inspire, support and remind you that you're not alone. Every story is reviewed before publication.",
  alternates: { canonical: PATHNAME },
};

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;

  const search = readParam(params, "search");
  const category = readParam(params, "category");
  const page = readPage(params);

  const [results, counts] = await Promise.all([
    getStories({ search, category, page, pageSize: PAGE_SIZE }),
    getStoryCategoryCounts(),
  ]);

  const from = (results.page - 1) * results.pageSize + 1;
  const to = Math.min(results.page * results.pageSize, results.total);

  return (
    <>
      <PageHero
        title="Community Stories"
        scriptLine={<ScriptAccent>You are not alone.</ScriptAccent>}
        description="Real journeys. Real experiences. Shared to inspire, support and remind you that others understand."
        image={{
          src: "/stories.png",
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

      <Container className="py-10 md:py-14">
        <FilterChips
          label="Filter stories by category"
          paramKey="category"
          allLabel="All Stories"
          active={category}
          pathname={PATHNAME}
          searchParams={params}
          options={STORY_CATEGORIES.map((value) => ({
            value,
            label: value,
            count: counts[value] ?? 0,
          }))}
        />

        <SearchBar
          label="Search stories"
          placeholder="Search stories by title, topic or keyword…"
          className="mt-5 max-w-md"
        />

        <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
          {results.total > 0
            ? `Showing ${from}–${to} of ${results.total} stories`
            : "No stories found"}
        </p>

        {results.items.length ? (
          <>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.items.map((story) => (
                <li key={story.id} className="flex">
                  <StoryCard story={story} className="w-full" />
                </li>
              ))}
            </ul>

            <Pagination
              page={results.page}
              totalPages={results.totalPages}
              pathname={PATHNAME}
              searchParams={params}
              className="mt-10"
            />
          </>
        ) : (
          <EmptyState
            className="mt-6"
            title="No stories match that yet"
            description="Try another category, or clear your search to see every story."
            action={
              <ButtonLink href={PATHNAME} variant="outline">
                View all stories
              </ButtonLink>
            }
          />
        )}

        <div className="mt-14 rounded-3xl bg-surface px-6 py-12 text-center md:px-12">
          <h2 className="font-heading text-xl font-bold text-foreground md:text-2xl">
            Your Story Could Be the Hope Someone Needs Today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Sharing is entirely your choice, and you can stay anonymous. Every
            story is read and reviewed with care before it&apos;s published.
          </p>
          <ButtonLink href="/contact?topic=story" size="lg" className="mt-7">
            Share Your Story
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}

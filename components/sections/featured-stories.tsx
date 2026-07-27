import { StoryCard } from "@/components/cards/story-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { getFeaturedStories } from "@/lib/repositories/stories";

/** Homepage section 5 — community stories. */
export async function FeaturedStories() {
  const stories = await getFeaturedStories(6);

  if (!stories.length) return null;

  return (
    <section aria-labelledby="featured-stories" className="py-16 md:py-20">
      <Container>
        <SectionHeader
          id="featured-stories"
          title="Community Stories"
          scriptLine="You are not alone."
          description="Real journeys, shared to inspire, support and remind you that others understand."
          action={{ label: "Read All Stories", href: "/stories" }}
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <li key={story.id} className="flex">
              <StoryCard story={story} className="w-full" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

import { ResourceCard } from "@/components/cards/resource-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { getFeaturedResources } from "@/lib/repositories/resources";

/** Homepage section 3 — a curated slice of the education library. */
export async function FeaturedResources() {
  const resources = await getFeaturedResources(6);

  // Sections self-suppress when empty rather than rendering a heading over a
  // blank grid. With a CMS behind this, an empty rail is a normal editorial
  // state, not a bug.
  if (!resources.length) return null;

  return (
    <section aria-labelledby="featured-resources" className="py-16 md:py-20">
      <Container>
        <SectionHeader
          id="featured-resources"
          title="Featured Resources"
          description="Trusted education to help you learn, understand and make informed decisions."
          action={{ label: "View All Resources", href: "/resources" }}
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <li key={resource.id} className="flex">
              <ResourceCard resource={resource} className="w-full" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

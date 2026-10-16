import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { JoinCommunityCTA } from "@/components/sections/join-community-cta";
import { TrustChips } from "@/components/shared/trust-chips";
import { getAllEvents } from "@/lib/repositories/events";
import { EventsListing, EventsResults } from "./events-listing";

const PATHNAME = "/events";

export const metadata: Metadata = {
  title: "Events & Webinars",
  description:
    "Learn from fertility experts, hear inspiring stories and join educational conversations from anywhere in the world.",
  alternates: { canonical: PATHNAME },
};

/**
 * Events, split into Upcoming and Replay Library.
 *
 * The tab is a URL parameter, not component state, so a replay link is
 * shareable and lands on the right tab. The two tabs also paginate
 * independently — switching tabs resets the page, which `buildHref` handles.
 */
export default async function EventsPage() {
  // Transcripts are long and no card shows them.
  const events = (await getAllEvents()).map((event) => ({
    ...event,
    transcript: undefined,
  }));

  // One object for both, so the shared reference is serialised once.
  const listing = { events };

  return (
    <>
      <PageHero
        title="Events & Webinars"
        description="Learn from fertility experts, hear inspiring stories and join educational conversations from anywhere in the world."
        image={{
          src: "/events.webp",
          alt: "A laptop on a desk showing a Global Fertility Hub webinar invitation, beside a stack of fertility books and a mug.",
        }}
      >
        <TrustChips
        className="xl:grid-cols-2"
          chips={[
            {
              icon: "shield",
              title: "Expert-led sessions",
              description: "Fertility specialists, embryologists and more",
            },
            {
              icon: "globe",
              title: "Global access",
              description: "Join live or watch replays at your convenience",
            },
          ]}
        />
      </PageHero>

      <Suspense fallback={<EventsResults {...listing} params={{}} />}>
        <EventsListing {...listing} />
      </Suspense>

      <JoinCommunityCTA
        title="Never Miss a Session"
        description="Join our community to hear about upcoming webinars and new replays as soon as they're announced, wherever you are in the world."
      />
    </>
  );
}

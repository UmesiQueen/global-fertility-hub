import { EventCard } from "@/components/cards/event-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { getFeaturedEvents } from "@/lib/repositories/events";

/** Homepage section 6 — upcoming events and webinars. */
export async function UpcomingEvents() {
  const events = await getFeaturedEvents(3);

  if (!events.length) return null;

  return (
    <section
      aria-labelledby="upcoming-events"
      className="bg-surface py-16 md:py-20"
    >
      <Container>
        <SectionHeader
          id="upcoming-events"
          title="Upcoming Events & Webinars"
          description="Learn from fertility experts, hear inspiring stories and join educational conversations from anywhere in the world."
          action={{ label: "View All Events", href: "/events" }}
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.id} className="flex">
              <EventCard event={event} className="w-full" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

import type { Event } from "@/types";
import { hygraphFetch } from "./client";
import { asset, enumIn } from "./map";

const QUERY = `query Events($stage: Stage!) {
  events(stage: $stage, first: 100) {
    id
    slug
    title
    type
    description
    startsAt
    timezone
    durationMinutes
    tags
    registrationUrl
    replayUrl
    transcript
    slidesUrl
    isFeatured
    speakers { name role organisation }
    downloads { label url meta }
    image { url altText }
  }
}`;

export async function fetchEvents(): Promise<Event[]> {
  const data = await hygraphFetch<{ events: Event[] }>(QUERY);

  return data.events.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    type: enumIn(e.type) as Event["type"],
    description: e.description ?? "",
    startsAt: e.startsAt,
    timezone: e.timezone ?? "UTC",
    durationMinutes: e.durationMinutes ?? 60,
    speakers: e.speakers ?? [],
    tags: (e.tags ?? []).map(enumIn) as Event["tags"],
    image: asset(e.image, e.title),
    registrationUrl: e.registrationUrl ?? undefined,
    // Presence of replayUrl is what moves an event to the Replay Library.
    replayUrl: e.replayUrl ?? undefined,
    transcript: e.transcript ?? undefined,
    slidesUrl: e.slidesUrl ?? undefined,
    downloads: e.downloads?.length ? e.downloads : undefined,
    isFeatured: e.isFeatured ?? undefined,
  }));
}

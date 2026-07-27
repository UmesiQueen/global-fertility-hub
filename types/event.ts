import type { Entity, ImageAsset } from "./shared";

export type EventType = "webinar" | "live-qa" | "panel-discussion" | "workshop";

export interface EventSpeaker {
  name: string;
  role: string;
  organisation?: string;
  photo?: ImageAsset;
}

export interface EventDownload {
  label: string;
  url: string;
  /** e.g. "PDF · 2.4 MB" */
  meta?: string;
}

export interface Event extends Entity {
  title: string;
  image: ImageAsset;
  type: EventType;
  description: string;
  startsAt: string; // ISO 8601 with offset
  /** IANA zone, e.g. "Australia/Perth". Displayed alongside local time. */
  timezone: string;
  durationMinutes: number;
  speakers: EventSpeaker[];
  registrationUrl?: string;

  /**
   * Post-event fields. Presence of `replayUrl` is what moves an event
   * from "Upcoming Events" into the "Replay Library" tab.
   */
  replayUrl?: string;
  transcript?: string;
  slidesUrl?: string;
  downloads?: EventDownload[];

  isFeatured?: boolean;
}

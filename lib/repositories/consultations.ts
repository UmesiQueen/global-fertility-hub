import {
  availability,
  consultationFaqs,
  consultationTypes,
} from "@/lib/data/consultations";
import type {
  AvailabilitySlot,
  ConsultationFaq,
  ConsultationType,
} from "@/types";

/** The only supported way for a page to read consultation content. */

export async function getConsultationTypes(): Promise<ConsultationType[]> {
  return consultationTypes;
}

export async function getConsultationTypeById(
  id: string,
): Promise<ConsultationType | null> {
  return consultationTypes.find((item) => item.id === id) ?? null;
}

export async function getConsultationFaqs(): Promise<ConsultationFaq[]> {
  return consultationFaqs;
}

/**
 * Availability from now onward.
 *
 * Filters on the instant, not the date string — a 9am slot is gone by 10am
 * even though "today" is still today. Days left with no future slots drop out
 * entirely so the calendar never shows a selectable date with nothing behind
 * it.
 */
export async function getAvailability(
  now = new Date(),
): Promise<AvailabilitySlot[]> {
  return availability
    .map((slot) => ({
      ...slot,
      starts: slot.starts.filter(
        (start) => new Date(start).getTime() > now.getTime(),
      ),
    }))
    .filter((slot) => slot.starts.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getAvailabilityForDate(
  date: string,
  now = new Date(),
): Promise<string[]> {
  const days = await getAvailability(now);
  return days.find((item) => item.date === date)?.starts ?? [];
}

/**
 * Confirms a slot is still genuinely on offer.
 *
 * The server action calls this before writing anything — a booking form left
 * open overnight would otherwise submit a slot that has since passed.
 */
export async function isSlotAvailable(
  start: string,
  now = new Date(),
): Promise<boolean> {
  const days = await getAvailability(now);
  return days.some((day) => day.starts.includes(start));
}

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
 * Availability from today onward. Past dates are filtered here so the
 * calendar can never offer a slot in the past, whatever the data says.
 */
export async function getAvailability(
  now = new Date(),
): Promise<AvailabilitySlot[]> {
  const today = now.toISOString().slice(0, 10);
  return availability
    .filter((slot) => slot.date >= today && slot.times.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getAvailabilityForDate(
  date: string,
): Promise<string[]> {
  const slot = availability.find((item) => item.date === date);
  return slot?.times ?? [];
}

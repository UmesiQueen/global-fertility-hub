import type { ConsultationFaq, ConsultationType } from "@/types";
import { hygraphFetch } from "./client";

/** Session types and FAQs. Availability stays in code — see docs/hygraph-schema.md §6. */

const TYPES_QUERY = `{
  consultationTypes(first: 20) {
    id
    name
    description
    audience
    durationMinutes
    price
    currency
  }
}`;

export async function fetchConsultationTypes(): Promise<ConsultationType[]> {
  const data = await hygraphFetch<{ consultationTypes: any[] }>(TYPES_QUERY);

  return data.consultationTypes.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description ?? "",
    audience: c.audience as ConsultationType["audience"],
    durationMinutes: c.durationMinutes ?? 60,
    price: c.price ?? 0,
    currency: (c.currency ?? "AUD") as ConsultationType["currency"],
  }));
}

const FAQS_QUERY = `{
  consultationFaqs(first: 50) {
    question
    answer
  }
}`;

export async function fetchConsultationFaqs(): Promise<ConsultationFaq[]> {
  const data = await hygraphFetch<{ consultationFaqs: ConsultationFaq[] }>(
    FAQS_QUERY,
  );
  return data.consultationFaqs;
}

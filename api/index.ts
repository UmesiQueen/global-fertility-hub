/**
 * Hygraph queries. One named query per model, mapped to our own types.
 *
 * Each file is a query string and a `fetchX()` that returns an array. No
 * filtering, sorting or pagination lives here — the repositories do all of
 * that in memory, which is why the queries can stay this plain.
 *
 * The one argument worth keeping is `first: 100`. Hygraph returns **10**
 * records when you omit it, which looks exactly like missing content. Raise
 * it if a collection ever outgrows 100.
 *
 * Pages don't import this — they go through `lib/repositories/*`.
 */

export { hygraphFetch } from "./client";
export { fetchClinics } from "./clinics";
export { fetchConsultationFaqs, fetchConsultationTypes } from "./consultations";
export { fetchDiscounts } from "./discounts";
export { fetchEvents } from "./events";
export { fetchProducts } from "./products";
export { fetchResources } from "./resources";
export { fetchStories } from "./stories";

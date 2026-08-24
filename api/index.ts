/**
 * Hygraph queries. One per model, returning our own types from `types/`.
 *
 * Pages don't import these — they go through `lib/repositories/*`, which
 * handles filtering, sorting, pagination and relatedness.
 */

export { hygraphFetch } from "./client";
export { fetchResources } from "./resources";
export { fetchStories } from "./stories";
export { fetchClinics } from "./clinics";
export { fetchEvents } from "./events";
export { fetchProducts } from "./products";
export { fetchDiscounts } from "./discounts";
export { fetchConsultationTypes, fetchConsultationFaqs } from "./consultations";

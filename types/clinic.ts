import type { Entity, ImageAsset } from "./shared";

/**
 * IMPORTANT: clinics are "Educational Clinic Partners".
 * There is deliberately no rating, ranking, score or review field on this
 * type, and none should ever be added without an explicit client decision.
 * The platform showcases educational partnerships — it does not endorse.
 */

export type Treatment =
  | "ivf"
  | "icsi"
  | "iui"
  | "egg-freezing"
  | "egg-donation"
  | "sperm-donation"
  | "embryo-donation"
  | "surrogacy"
  | "genetic-testing"
  | "fertility-preservation"
  | "recurrent-miscarriage"
  | "lgbtq-family-building"
  | "pgt-a";

export interface ClinicTeamMember {
  name: string;
  role: string;
  photo?: ImageAsset;
  bio?: string;
}

export interface PartnerBenefit {
  title: string;
  description: string;
}

export interface Clinic extends Entity {
  name: string;
  logo: ImageAsset;
  coverImage: ImageAsset;
  /** Short paragraph shown at the top of the profile. */
  intro: string;
  country: string;
  /** ISO 3166-1 alpha-2 — drives the flag chip on cards. */
  countryCode: string;
  city: string;
  treatments: Treatment[];
  specialties: string[];
  languages: string[];
  services: string[];
  team: ClinicTeamMember[];
  partnerBenefits: PartnerBenefit[];
  website: string;
  contactEmail?: string;
  contactPhone?: string;
  /** Always true — the badge is part of the product's framing. */
  isEducationalPartner: true;
  isFeatured?: boolean;
  joinedAt: string; // ISO 8601 — powers "Recently Added" sort
}

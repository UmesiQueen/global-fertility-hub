import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { Pill } from "@/components/shared/pill";
import { TrustChips } from "@/components/shared/trust-chips";
import {
  getAllClinics,
  getClinicFilterOptions,
} from "@/lib/repositories/clinics";
import { PartnersListing, PartnersResults } from "./partners-listing";

const PATHNAME = "/educational-partners";

export const metadata: Metadata = {
  title: "Clinic Directory",
  description:
    "Fertility clinics worldwide that share our commitment to education, transparency and informed decision-making. We showcase partners — we don't rank or recommend them.",
  alternates: { canonical: PATHNAME },
};

export default async function EducationalPartnersPage() {
  const [clinics, options] = await Promise.all([
    getAllClinics(),
    getClinicFilterOptions(),
  ]);

  // One object for both, so the shared reference is serialised once.
  const listing = { clinics, options };

  return (
    <>
      <PageHero
        eyebrow={<Pill>Trusted · Transparent · Educational</Pill>}
        title="Clinics in our community"
        description="We partner with fertility clinics worldwide that share our commitment to education, transparency and informed decision-making."
        image={{
          src: "/clinic.webp",
          alt: "A bright, calm fertility clinic reception with soft seating and a glowing \u2018Fertility Care\u2019 sign above the desk.",
        }}
      >
        <TrustChips
          className="xl:grid-cols-2"
          chips={[
            {
              icon: "shield",
              title: "Educational partnerships",
              description: "Not rankings or recommendations",
            },
            {
              icon: "globe",
              title: "Information you can trust",
              description: "So you can explore with confidence",
            },
          ]}
        />
      </PageHero>

      <Suspense fallback={<PartnersResults {...listing} params={{}} />}>
        <PartnersListing {...listing} />
      </Suspense>
    </>
  );
}

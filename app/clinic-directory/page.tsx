import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { JoinCommunityCTA } from "@/components/sections/join-community-cta";
import { TrustChips } from "@/components/shared/trust-chips";
import {
  getAllClinics,
  getClinicFilterOptions,
} from "@/lib/repositories/clinics";
import {
  ClinicDirectoryListing,
  ClinicDirectoryResults,
} from "./clinic-directory-listing";

const PATHNAME = "/clinic-directory";

export const metadata: Metadata = {
  title: "Clinic Directory",
  description:
    "Fertility clinics worldwide that share our commitment to education, transparency and informed decision-making. We showcase partners — we don't rank or recommend them.",
  alternates: { canonical: PATHNAME },
};

export default async function ClinicDirectoryPage() {
  const [clinics, options] = await Promise.all([
    getAllClinics(),
    getClinicFilterOptions(),
  ]);

  // One object for both, so the shared reference is serialised once.
  const listing = { clinics, options };

  return (
    <>
      <PageHero
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

      <Suspense fallback={<ClinicDirectoryResults {...listing} params={{}} />}>
        <ClinicDirectoryListing {...listing} />
      </Suspense>

      <JoinCommunityCTA
        title="Not Sure What to Ask a Clinic?"
        description="We can't tell you which clinic to choose, but we can help you feel prepared. Talk it through with people who've been there, or learn alongside others in our community."
      />
    </>
  );
}

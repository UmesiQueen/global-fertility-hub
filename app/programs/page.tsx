import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { PartnerWithUs } from "@/components/sections/partner-with-us";
import { ProgramsGetInvolved } from "@/components/sections/programs-get-involved";
import { ProgramsImpact } from "@/components/sections/programs-impact";
import { ProgramsOverview } from "@/components/sections/programs-overview";
import { ProgramsWhoWeSupport } from "@/components/sections/programs-who-we-support";
import { JsonLd } from "@/components/shared/json-ld";
import { ScriptAccent } from "@/components/shared/script-accent";
import { breadcrumbJsonLd, organisationJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Our Programs",
  description:
    "Fertility Without Borders, You Are Not Alone, and Fertility Voices & Advocacy: three Global Fertility Hub programs for fertility education, support and advocacy.",
  alternates: { canonical: "/programs" },
  openGraph: {
    title: "Our Programs",
    description:
      "Breaking barriers. Building knowledge. Supporting fertility journeys.",
  },
};

const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
];

export default function ProgramsPage() {
  return (
    <>
      <JsonLd data={[organisationJsonLd(), breadcrumbJsonLd(CRUMBS)]} />

      <PageHero
        title="Our Programs"
        fadeLeft={10}
        scriptLine={
          <ScriptAccent>
            Breaking barriers. Supporting fertility
            journeys.
          </ScriptAccent>
        }
        description="We believe everyone deserves reliable fertility information, compassionate support and the knowledge to make informed decisions, whatever their location, background or finances. Through our three programs, we work to close information gaps, support people and communities, and advocate for more inclusive fertility care."
        image={{
          src: "/programs.webp",
          alt: "Hands of different skin tones cupped around a paper cut-out family and a purple heart, in front of a world map and a globe, beside icons for our three programs: Fertility Without Borders, You Are Not Alone, and Fertility Voices & Advocacy.",
        }}
      />

      <ProgramsOverview />
      <ProgramsWhoWeSupport />
      <ProgramsGetInvolved />
      <ProgramsImpact />
      <PartnerWithUs />
    </>
  );
}

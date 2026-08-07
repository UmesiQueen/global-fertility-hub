import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about-hero";
import { JoinCommunity } from "@/components/sections/join-community";
import { MissionVisionPromise } from "@/components/sections/mission-vision-promise";
import { OurStoryTimeline } from "@/components/sections/our-story-timeline";
import { JsonLd } from "@/components/shared/json-ld";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Container } from "@/components/layout/container";
import { breadcrumbJsonLd, organisationJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Henry and Precious created Global Fertility Hub after their own fertility journey — so no one has to feel alone or confused. Our story, mission and promise.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Why We Started This Journey",
    description:
      "Our own fertility journey inspired us to create a place where no one has to feel alone or confused.",
  },
};

const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

/**
 * About.
 *
 * Covers the five things the brief asks for: Our Story, Mission, Vision,
 * Henry & Precious, and Values (rendered as "Our Promise").
 *
 * The closing CTA reuses the homepage's JoinCommunity section rather than a
 * bespoke band — the message is identical, and one component means the
 * community invitation reads the same wherever someone meets it.
 */
export default function AboutPage() {
  return (
    <>
      <JsonLd data={[organisationJsonLd(), breadcrumbJsonLd(CRUMBS)]} />

      <AboutHero />
      <OurStoryTimeline />
      <MissionVisionPromise />

      <Container className="py-12 md:py-16">
        <MedicalDisclaimer variant="card" className="mx-auto max-w-2xl" />
      </Container>

      <JoinCommunity />
    </>
  );
}

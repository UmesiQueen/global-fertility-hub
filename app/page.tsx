import type { Metadata } from "next";
import { FeaturedPartners } from "@/components/sections/featured-partners";
import { FeaturedResources } from "@/components/sections/featured-resources";
import { FeaturedStories } from "@/components/sections/featured-stories";
import { HomeHero } from "@/components/sections/home-hero";
import { JoinCommunity } from "@/components/sections/join-community";
import { UpcomingEvents } from "@/components/sections/upcoming-events";
import { WhyWeExist } from "@/components/sections/why-we-exist";

export const metadata: Metadata = {
  title: "Global Fertility Hub — Trusted Fertility Education & Support",
  description:
    "Trusted education, real stories and a global community here to support you through every step of your fertility journey.",
  alternates: { canonical: "/" },
};

/**
 * Homepage — the nine sections from PROJECT_PLAN.md §5.
 * Sections 1 and 2 (hero, feature panel) live in HomeHero; 9 is the footer.
 *
 * A Server Component: every section fetches its own content, so nothing is
 * prop-drilled from here and each section can be moved or reused on another
 * page without rewiring.
 *
 * Section backgrounds alternate plain / surface deliberately — the tinted
 * bands are what separate them without needing rules between every one.
 */
export default function Home() {
  return (
    <>
      <HomeHero />
      <FeaturedResources />
      <FeaturedPartners />
      <FeaturedStories />
      <UpcomingEvents />
      <WhyWeExist />
      <JoinCommunity />
    </>
  );
}

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

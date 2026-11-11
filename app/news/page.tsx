import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/shared/button-link";

// PLACEHOLDER: the menu links here before the news content exists.
// Remove `robots` once the real page lands.
export const metadata: Metadata = {
  title: "News",
  description:
    "Fertility and reproductive health news, plus updates from Global Fertility Hub.",
  alternates: { canonical: "/news" },
  robots: { index: false, follow: true },
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        title="News"
        description="Fertility and reproductive health news, plus updates from Global Fertility Hub. Our first stories are on their way."
      />
      <Container className="flex flex-col gap-3 py-12 sm:flex-row md:py-16">
        <ButtonLink href="/resources" size="lg">
          Explore Resources
        </ButtonLink>
        <ButtonLink href="/" variant="outline" size="lg">
          Back to Home
        </ButtonLink>
      </Container>
    </>
  );
}

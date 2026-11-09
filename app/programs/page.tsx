import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/shared/button-link";

// PLACEHOLDER: the menu links here before the programs content exists.
// Remove `robots` once the real page lands.
export const metadata: Metadata = {
  title: "Programs",
  description:
    "Global Fertility Hub programs for fertility education, access and emotional support.",
  alternates: { canonical: "/programs" },
  robots: { index: false, follow: true },
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        title="Our Programs"
        description="Our programs bring education, access and emotional support to people wherever they are. Details are on their way."
      />
      <Container className="flex flex-col gap-3 py-12 sm:flex-row md:py-16">
        <ButtonLink href="/collections" size="lg">
          Explore Collections
        </ButtonLink>
        <ButtonLink href="/" variant="outline" size="lg">
          Back to Home
        </ButtonLink>
      </Container>
    </>
  );
}

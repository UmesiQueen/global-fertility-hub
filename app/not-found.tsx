import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Image
        src="/not-found.webp"
        alt="A heart-shaped line drawing with flowers, framing the number 404."
        width={267}
        height={150}
        unoptimized
        priority
        className="h-37.5 w-auto"
      />
      <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">
          Go Back Home
        </ButtonLink>
        <ButtonLink href="/collections" variant="link" size="lg">
          Explore Collections
        </ButtonLink>
      </div>
    </Container>
  );
}

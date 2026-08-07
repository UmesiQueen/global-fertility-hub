import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { EntityImage } from "@/components/shared/entity-image";
import { ScriptAccent } from "@/components/shared/script-accent";

/**
 * About hero — Henry & Precious's story.
 *
 * Carries `id="henry-and-precious"` because the footer links to
 * `/about#henry-and-precious`. This block is where they're introduced, so the
 * anchor belongs here rather than on an invented separate section.
 *
 * COPY WARNING: the paragraphs below describe a real couple's pregnancy loss
 * and treatment history. Every word must be confirmed by Henry & Precious
 * themselves before launch — not paraphrased, not softened, not embellished
 * by anyone else.
 */
export function AboutHero() {
  return (
    <section
      id="henry-and-precious"
      className="relative overflow-hidden bg-surface"
    >
      {/* Photo bleeds off the right edge from lg, matching the mockup. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] lg:block">
        <EntityImage
          image={{
            src: "",
            alt: "Henry and Precious standing together at home, smiling.",
          }}
          sizes="55vw"
          priority
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-surface via-surface/70 to-transparent"
        />
      </div>

      <Container className="relative z-10 pt-8 pb-12 md:pb-16">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Why We Started This Journey" },
          ]}
        />

        <div className="mt-6 lg:max-w-[45%]">
          <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
            Why We Started
            <br />
            This Journey
          </h1>

          <ScriptAccent className="mt-1 block text-2xl md:text-3xl">
            Our story. Our why. Our mission.
          </ScriptAccent>

          <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
            <p>
              We&apos;re Henry and Precious, and our own fertility journey
              inspired us to create a place where no one has to feel alone or
              confused.
            </p>
            <p>
              After facing loss, uncertainty and many unanswered questions, we
              realised how hard it is to find clear, trustworthy information and
              real support when you need it most.
            </p>
            <p className="font-medium text-foreground">
              Global Fertility Hub was born from that experience.
            </p>
          </div>

          {/* Contained photo below the copy on smaller screens, where the
              bleeding layout would push the couple out of frame. */}
          <div className="relative mt-8 aspect-[3/2] w-full overflow-hidden rounded-2xl lg:hidden">
            <EntityImage
              image={{
                src: "",
                alt: "Henry and Precious standing together at home, smiling.",
              }}
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

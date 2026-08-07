import { Droplet, Heart, Sprout, Sun, Users } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

/**
 * "Our Story in a Nutshell" — five steps from hoping to giving back.
 *
 * COPY WARNING: steps two and three describe real pregnancy losses and
 * treatment. Confirm the wording with Henry & Precious before launch.
 *
 * The middle of this list is the hardest part of their story, and the section
 * is deliberately plain — no animation, no dramatic styling. Someone reading
 * it may be in the same place right now.
 */
const STEPS = [
  {
    icon: Heart,
    title: "We Dreamed",
    description:
      "Like many couples, we dreamed of starting a family and building the life we envisioned together.",
  },
  {
    icon: Droplet,
    title: "We Faced Heartbreak",
    description:
      "We experienced miscarriage and two ectopic pregnancies that changed our path.",
  },
  {
    icon: Sprout,
    title: "We Kept Going",
    description:
      "We went through three rounds of IVF, full of hope, fear and lessons.",
  },
  {
    icon: Users,
    title: "We Found Strength",
    description:
      "Through community, faith and education, we found the strength to keep believing.",
  },
  {
    icon: Sun,
    title: "We Want to Give Back",
    description:
      "Now, we're here to make the journey a little easier for others, with the support we wish we had.",
  },
];

export function OurStoryTimeline() {
  return (
    <section aria-labelledby="our-story" className="py-14 md:py-20">
      <Container>
        <h2
          id="our-story"
          className="text-center font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
        >
          Our Story in a Nutshell
        </h2>

        {/* An ordered list, because the sequence is the meaning. */}
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-5 lg:gap-5">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative flex flex-col">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-primary"
                >
                  <step.icon className="size-5" />
                </span>

                {/* Connector to the next step. Hidden on the last item and
                    below lg, where the steps stack and a horizontal rule
                    would point at nothing. */}
                {index < STEPS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "hidden h-px flex-1 bg-border lg:block",
                    )}
                  />
                ) : null}
              </div>

              <h3 className="mt-4 font-heading text-base font-semibold text-primary">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

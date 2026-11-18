import {
  ArrowDown,
  BookOpen,
  Handshake,
  MapPin,
  Presentation,
  Users,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { ScriptAccent } from "@/components/shared/script-accent";

// No figures until there are real ones to report. Never fill these with
// estimates — add a measured number to a measure when it exists.
const MEASURES = [
  {
    icon: Users,
    title: "People supported",
    description:
      "Individuals and couples who have joined our community, booked an encouragement session or reached out to us for support.",
    program: "You Are Not Alone",
  },
  {
    icon: MapPin,
    title: "Countries reached",
    description:
      "Where the people we support live, so we can see whether we're truly reaching beyond borders and into underserved communities.",
    program: "Fertility Without Borders",
  },
  {
    icon: Presentation,
    title: "Educational sessions delivered",
    description:
      "Webinars, talks and community sessions, and how many people were able to join them.",
    program: "Fertility Voices & Advocacy",
  },
  {
    icon: BookOpen,
    title: "Resources accessed",
    description:
      "How often our guides and articles are read, and which topics people are looking for most, so we know what to create next.",
    program: "Fertility Without Borders",
  },
  {
    icon: Handshake,
    title: "Partnerships established",
    description:
      "Educational clinic partners, organisations and community groups working with us to reach more people.",
    program: "Fertility Voices & Advocacy",
  },
];

export function ProgramsImpact() {
  return (
    <section
      aria-labelledby="our-impact"
      className="bg-surface py-14 md:py-20"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2
              id="our-impact"
              className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
            >
              Our Impact & Future Goals
            </h2>
            <ScriptAccent className="mt-1 block text-2xl md:text-3xl">
              Real numbers, when we have them.
            </ScriptAccent>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Our programs are just beginning, and we&apos;d rather be honest
              than impressive. So you won&apos;t find estimates or rounded-up
              figures here.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Instead, here&apos;s what we&apos;ll be measuring and why it
              matters. As each program grows, we&apos;ll share the real figures
              in this space.
            </p>

            <a
              href="#partner-with-us"
              className="mt-7 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Help us reach these goals
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>

          <ol className="divide-y divide-border border-y border-border">
            {MEASURES.map((measure) => (
              <li key={measure.title} className="flex gap-4 py-6 md:gap-5">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background text-primary"
                >
                  <measure.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {measure.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {measure.description}
                  </p>
                  <p className="mt-2.5 text-xs font-medium text-primary">
                    <span className="sr-only">Program: </span>
                    {measure.program}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

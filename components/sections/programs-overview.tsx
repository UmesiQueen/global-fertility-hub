import { Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { EntityImage } from "@/components/shared/entity-image";
// import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Pill } from "@/components/shared/pill";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

interface ProgramActivity {
  label: string;
  /** Not running yet. Shown with a "Planned" chip so we never overclaim. */
  planned?: boolean;
}

interface Program {
  id: string;
  title: string;
  pillars: [string, string, string];
  description: string;
  activities: ProgramActivity[];
  /** `src: ""` falls back to the themed placeholder. */
  image: ImageAsset;
}

// Hardcoded for launch. Move to Hygraph when each program gets a detail page.
const PROGRAMS: Program[] = [
  {
    id: "fertility-without-borders",
    title: "Fertility Without Borders",
    pillars: ["Access", "Inclusion", "Education"],
    description:
      "Our flagship program works to reduce the geographical, cultural, language and financial barriers that keep people from reliable fertility information — especially in underserved communities and for people navigating healthcare in a new country.",
    activities: [
      { label: "Plain-English fertility education" },
      { label: "Country-specific information" },
      {
        label:
          "Guidance for finding your way around an unfamiliar healthcare system",
      },
      { label: "Resources in more languages", planned: true },
    ],
    image: {
      src: "/program1.webp",
      alt: "A facilitator holding an illustrated booklet talks with a small, diverse group in a bright community room. Some hold leaflets and a tablet, and a world map hangs on the wall.",
    },
  },
  {
    id: "you-are-not-alone",
    title: "You Are Not Alone",
    pillars: ["Community", "Encouragement", "Connection"],
    description:
      "Fertility challenges can feel isolating. This program creates welcoming spaces where individuals and couples can share their experiences, find encouragement and connect with others who understand their journey.",
    activities: [
      { label: "Free 20-minute encouragement sessions" },
      { label: "Community stories" },
      { label: "Peer connection" },
      { label: "Moderated support conversations" },
    ],
    image: {
      src: "/program2.webp",
      alt: "A couple sit close together on a sofa, holding hands and smiling, as they talk with a warm older woman in an armchair over mugs of tea in a bright living room.",
    },
  },
  {
    id: "fertility-voices-and-advocacy",
    title: "Fertility Voices & Advocacy",
    pillars: ["Awareness", "Partnerships", "Change"],
    description:
      "This program raises awareness of fertility challenges, tackles stigma and works towards fairer access to fertility education and care through public engagement and collaboration.",
    activities: [
      { label: "Awareness campaigns" },
      { label: "Expert-led webinars" },
      { label: "Educational clinic partnerships" },
      { label: "Research-informed advocacy" },
      { label: "Community engagement" },
    ],
    image: {
      src: "/program3.webp",
      alt: "A speaker at a lectern addresses a full community hall. A diverse audience listens, and a young woman raises her hand to ask a question.",
    },
  },
];

export function ProgramsOverview() {
  return (
    <section aria-labelledby="our-programs" className="py-14 md:py-20">
      <Container>
        <SectionHeader
          id="our-programs"
          title="Three Programs, One Purpose"
          // scriptLine="We educate. We support. We advocate."
          description="Each program brings together practical activities — resources, sessions, events and partnerships — around one clear goal."
        />

        <ol className="mt-10 flex flex-col gap-14 md:mt-14 md:gap-20">
          {PROGRAMS.map((program, index) => (
            <li key={program.id}>
              <article
                aria-labelledby={`program-${program.id}`}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <div
                  className={cn(
                    "relative aspect-3/2 w-full overflow-hidden rounded-3xl border border-border lg:aspect-4/3",
                    index % 2 === 1 && "lg:order-last",
                  )}
                >
                  <EntityImage
                    image={program.image}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                <div>
                  <Pill>Program {String(index + 1).padStart(2, "0")}</Pill>

                  <h3
                    id={`program-${program.id}`}
                    className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
                  >
                    {program.title}
                  </h3>

                  <p className="mt-2 font-heading text-sm font-semibold text-primary">
                    {program.pillars.join(" · ")}
                  </p>

                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {program.description}
                  </p>

                  <h4 className="mt-6 font-heading text-sm font-semibold text-foreground">
                    Key activities
                  </h4>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {program.activities.map((activity) => (
                      <li
                        key={activity.label}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary"
                        >
                          <Check className="size-3" />
                        </span>
                        <span>
                          {activity.label}
                          {activity.planned ? (
                            <Pill tone="muted" className="ml-2 align-middle">
                              Coming soon
                            </Pill>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>

        {/* <MedicalDisclaimer variant="card" className="mt-14 md:mt-20">
          Our programs offer education and non-clinical support. Global
          Fertility Hub is not a clinic — we don&apos;t diagnose, treat or give
          medical advice. Always speak with a qualified healthcare professional
          about your own care.
        </MedicalDisclaimer> */}
      </Container>
    </section>
  );
}

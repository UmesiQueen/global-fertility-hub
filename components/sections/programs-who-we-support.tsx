import { Compass, Globe2, HeartHandshake, Users } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";

const AUDIENCES = [
  {
    icon: HeartHandshake,
    title: "Individuals and couples",
    description: "People living with infertility, wherever they are in their journey.",
  },
  {
    icon: Compass,
    title: "People exploring treatment",
    description: "Anyone weighing up their options and wanting clear, reliable information.",
  },
  {
    icon: Globe2,
    title: "People in a new country",
    description: "Those finding their way around a healthcare system that's new to them.",
  },
  {
    icon: Users,
    title: "Underserved communities",
    description: "Communities where fertility education is hard to find or hard to talk about.",
  },
];

export function ProgramsWhoWeSupport() {
  return (
    <section
      aria-labelledby="who-we-support"
      className="bg-surface py-14 md:py-20"
    >
      <Container>
        <SectionHeader
          id="who-we-support"
          title="Who Our Programs Support"
          align="center"
        />

        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {AUDIENCES.map((audience) => (
            <li key={audience.title} className="flex gap-4 lg:flex-col">
              <span
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary"
              >
                <audience.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {audience.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {audience.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

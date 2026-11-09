import {
  BookOpen,
  Compass,
  Globe2,
  Handshake,
  HeartHandshake,
  Languages,
  PiggyBank,
  Sprout,
  Users,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { ScriptAccent } from "@/components/shared/script-accent";

/**
 * "What We Work Towards" — the nine focus areas behind Our Mission.
 *
 * COPY GUARDRAILS: this is the section most likely to drift towards clinical
 * or recommending language. Clinics are something we help people *find and
 * understand*, never something we choose for them, and "care" always means
 * care from their own clinicians. Keep it that way when editing.
 */
const FOCUS_AREAS = [
  {
    icon: BookOpen,
    title: "Improve fertility awareness",
    description:
      "Many people and couples can't easily find reliable information about fertility and reproductive health. We want to change that.",
  },
  {
    icon: PiggyBank,
    title: "Break down financial barriers",
    description:
      "Fertility treatment can be expensive, especially for migrants and people without Medicare or enough health insurance.",
  },
  {
    icon: Users,
    title: "Overcome cultural stigma",
    description:
      "In many communities, infertility and fertility treatment are still misunderstood or hard to talk about openly.",
  },
  {
    icon: Languages,
    title: "Address language barriers",
    description:
      "We help migrants and culturally diverse communities understand their fertility options and the support available to them.",
  },
  {
    icon: Compass,
    title: "Improve access to care",
    description:
      "We help people find their way around healthcare systems and learn about fertility clinics and support services that may suit them.",
  },
  {
    icon: HeartHandshake,
    title: "Support emotional wellbeing",
    description:
      "We stand beside individuals and couples living with infertility, pregnancy loss and treatment that hasn't worked.",
  },
  {
    icon: Globe2,
    title: "Reach further, worldwide",
    description:
      "We want to reach underserved communities in Australia and around the world, especially where fertility education and healthcare are hard to access.",
  },
  {
    icon: Sprout,
    title: "Respond to global fertility challenges",
    description:
      "We raise awareness of reproductive health as birth rates fall and the ways people build families keep changing.",
  },
  {
    icon: Handshake,
    title: "Build partnerships",
    description:
      "We work with clinics, NGOs, healthcare professionals and community organisations to reach more people.",
  },
];

export function WhatWeWorkTowards() {
  return (
    <section
      aria-labelledby="what-we-work-towards"
      className="py-14 md:py-20"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="what-we-work-towards"
            className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl"
          >
            What We Work Towards
          </h2>
          <ScriptAccent className="mt-1 block text-2xl md:text-3xl">
            So no one is left out.
          </ScriptAccent>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Our mission shapes everything we do. Here&apos;s what it means in
            practice.
          </p>
        </div>

        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {FOCUS_AREAS.map((area) => (
            <li key={area.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary"
              >
                <area.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {area.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

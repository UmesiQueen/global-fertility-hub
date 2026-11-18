import {
  ArrowRight,
  BookOpen,
  CalendarHeart,
  PenLine,
  Presentation,
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";

const WAYS_TO_TAKE_PART = [
  {
    icon: CalendarHeart,
    title: "Book an encouragement session",
    description: "A free 20-minute conversation with Henry & Precious.",
    href: "/consultations",
    label: "Book a session",
  },
  {
    icon: BookOpen,
    title: "Explore educational resources",
    description: "Guides, articles and tools explained in plain English.",
    href: "/resources",
    label: "Browse resources",
  },
  {
    icon: Presentation,
    title: "Attend a webinar",
    description: "Learn from experts and ask your own questions.",
    href: "/events",
    label: "See upcoming events",
  },
  {
    icon: PenLine,
    title: "Share your story",
    description: "Help someone else feel less alone. You can stay anonymous.",
    href: "/contact?topic=story",
    label: "Share your story",
  },
];

export function ProgramsGetInvolved() {
  return (
    <section aria-labelledby="get-involved" className="py-14 md:py-20">
      <Container>
        <SectionHeader
          id="get-involved"
          title="Get Involved"
          description="Take part in our programs in whatever way feels right for you."
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WAYS_TO_TAKE_PART.map((way) => (
            <li key={way.title} className="flex">
              <Link
                href={way.href}
                className="group flex w-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary"
                >
                  <way.icon className="size-5" />
                </span>
                <h3 className="mt-5 font-heading text-base font-semibold text-foreground">
                  {way.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {way.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {way.label}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

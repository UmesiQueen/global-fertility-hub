import { ArrowRight, GraduationCap, MapPin } from "lucide-react";
import Link from "next/link";
import { EntityImage } from "@/components/shared/entity-image";
import { Pill } from "@/components/shared/pill";
import { countryFlag, titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Clinic } from "@/types";

export function ClinicCard({
  clinic,
  className,
}: {
  clinic: Clinic;
  className?: string;
}) {
  const flag = countryFlag(clinic.countryCode);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-shadow shadow-sm hover:shadow-lg hover:shadow-primary/8",
        className,
      )}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden">
        <EntityImage
          image={clinic.coverImage}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <Pill tone="overlay" className="absolute top-3 left-3">
          {flag ? (
            <span aria-hidden="true" className="not-sr-only">
              {flag}
            </span>
          ) : null}
          {clinic.country}
        </Pill>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base leading-snug font-semibold text-foreground">
          <Link
            href={`/educational-partners/${clinic.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:content-['']"
          >
            {clinic.name}
          </Link>
        </h3>

        <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
          {clinic.city}, {clinic.country}
        </p>

        <p className="mt-3 line-clamp-1 text-xs text-muted-foreground">
          {clinic.treatments.slice(0, 3).map(titleCase).join(" · ")}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
          <Pill icon={GraduationCap}>Educational Partner</Pill>
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            View Profile
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

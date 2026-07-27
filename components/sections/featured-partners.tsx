import { ClinicCard } from "@/components/cards/clinic-card";
import { Container } from "@/components/layout/container";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { SectionHeader } from "@/components/shared/section-header";
import { getFeaturedClinics } from "@/lib/repositories/clinics";

/**
 * Homepage section 4 — Educational Clinic Partners.
 *
 * The description and the disclaimer beneath the grid both exist to make the
 * framing unmistakable: these are educational partnerships, not
 * recommendations. Don't reword either without client sign-off.
 */
export async function FeaturedPartners() {
  const clinics = await getFeaturedClinics(6);

  if (!clinics.length) return null;

  return (
    <section
      aria-labelledby="featured-partners"
      className="bg-surface py-16 md:py-20"
    >
      <Container>
        <SectionHeader
          id="featured-partners"
          title="Educational Clinic Partners"
          description="We partner with fertility clinics worldwide that share our commitment to education, transparency and informed decision-making."
          action={{
            label: "Browse All Partners",
            href: "/educational-partners",
          }}
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clinics.map((clinic) => (
            <li key={clinic.id} className="flex">
              <ClinicCard clinic={clinic} className="w-full" />
            </li>
          ))}
        </ul>

        <MedicalDisclaimer variant="card" className="mt-8 max-w-2xl">
          Our partners are featured for their commitment to education. We do
          not rank, rate or recommend clinics — the right clinic is a decision
          for you and your healthcare team.
        </MedicalDisclaimer>
      </Container>
    </section>
  );
}

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/shared/json-ld";
import { Prose } from "@/components/shared/prose";
import { formatDate } from "@/lib/format";
import type { LegalDocument } from "@/lib/legal";
import { legalDocuments } from "@/lib/legal";
import { breadcrumbJsonLd } from "@/lib/seo";

/**
 * Shared shell for the three legal pages.
 *
 * They're built from the same component so the three can't drift apart in
 * layout or tone — and so the draft banner is impossible to remove from one
 * page while forgetting the others.
 */
export function LegalPage({ document }: { document: LegalDocument }) {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: document.title },
  ];

  const others = legalDocuments.filter((doc) => doc.slug !== document.slug);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <Container className="pt-8 pb-4">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <Container className="pb-16 md:pb-20">
        <div className="max-w-[68ch]">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {document.title}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {document.description}
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Last updated{" "}
            <time dateTime={document.lastUpdated}>
              {formatDate(document.lastUpdated)}
            </time>
          </p>

          {/*
            Deliberately loud, and deliberately at the top.
            A draft legal page that looks finished is worse than no page at
            all — someone could rely on it. Removed by setting `draft: false`
            in lib/legal.ts once a lawyer has signed off.
          */}
          {document.draft ? (
            <div
              role="note"
              className="mt-8 flex gap-3 rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4"
            >
              <AlertTriangle
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-destructive"
              />
              <div>
                <p className="font-heading text-sm font-semibold text-destructive">
                  Draft — not yet reviewed by a lawyer
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  This document describes how the site actually works, but it
                  hasn&apos;t been through legal review and shouldn&apos;t be
                  relied on yet. It must not go live in this state.
                </p>
              </div>
            </div>
          ) : null}

          <Prose content={document.body} className="mt-10" />

          <nav aria-label="Other legal pages" className="mt-14 border-t border-border pt-8">
            <h2 className="font-heading text-sm font-semibold text-foreground">
              Also worth reading
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {others.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/${doc.slug}`}
                    className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Ask us a question
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </>
  );
}

/** Shared metadata builder, so the three pages stay consistent. */
export function legalMetadata(document: LegalDocument) {
  return {
    title: document.title,
    description: document.description,
    alternates: { canonical: `/${document.slug}` },
    // Draft policies must never be indexed — a search result pointing at an
    // unreviewed privacy policy is a real problem.
    robots: document.draft ? { index: false, follow: true } : undefined,
  };
}

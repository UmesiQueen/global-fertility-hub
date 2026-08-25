import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, legalMetadata } from "@/components/layout/legal-page";
import { getLegalDocument } from "@/lib/legal";

const document = getLegalDocument("terms");

export const metadata: Metadata = document
  ? legalMetadata(document)
  : { title: "Not found" };

export default function TermsPage() {
  if (!document) notFound();
  return <LegalPage document={document} />;
}

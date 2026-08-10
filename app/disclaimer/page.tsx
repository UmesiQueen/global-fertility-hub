import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, legalMetadata } from "@/components/layout/legal-page";
import { getLegalDocument } from "@/lib/data/legal";

const document = getLegalDocument("disclaimer");

export const metadata: Metadata = document
  ? legalMetadata(document)
  : { title: "Not found" };

export default function DisclaimerPage() {
  if (!document) notFound();
  return <LegalPage document={document} />;
}

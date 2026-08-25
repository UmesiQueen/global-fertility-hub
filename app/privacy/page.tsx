import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, legalMetadata } from "@/components/layout/legal-page";
import { getLegalDocument } from "@/lib/legal";

const document = getLegalDocument("privacy");

export const metadata: Metadata = document
  ? legalMetadata(document)
  : { title: "Not found" };

export default function PrivacyPage() {
  if (!document) notFound();
  return <LegalPage document={document} />;
}

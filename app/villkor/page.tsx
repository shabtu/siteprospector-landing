import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { readLegalDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Villkor",
  alternates: { canonical: "/villkor" },
};

export default function TermsPage() {
  return <LegalPage doc={readLegalDocument("villkor-webbplats.md", "Villkor")} />;
}

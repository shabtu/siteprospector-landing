import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { readLegalDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  alternates: { canonical: "/integritet" },
};

export default function PrivacyPage() {
  return <LegalPage doc={readLegalDocument("integritetspolicy.md", "Integritetspolicy")} />;
}

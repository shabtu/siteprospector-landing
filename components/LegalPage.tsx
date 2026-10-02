import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import type { LegalDocument } from "@/lib/legal";

export default function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <div className="shell">
      <Nav />
      <main className="page shell-main">
        <article className="legal">
          <h1 className="legal-title">{doc.title}</h1>
          {/* The HTML comes from Markdown committed to this repo (see lib/legal.ts), not from visitors. */}
          <div className="legal-body" dangerouslySetInnerHTML={{ __html: doc.html }} />
        </article>
      </main>
      <Footer />
    </div>
  );
}

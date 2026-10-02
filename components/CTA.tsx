import AuditForm from "@/components/AuditForm";

export default function CTA() {
  return (
    <section className="cta-section" id="cta">
      <div className="page">
        <h2 className="cta-title">
          Vill ni se hur
          <br />
          <span className="gold">er hemsida</span> står sig?
        </h2>
        <p className="cta-sub">
          Skriv in adressen till er hemsida och er e-post. Vi analyserar hemsidan och skickar
          resultatet – gratis och utan förpliktelse.
        </p>
        <AuditForm />
      </div>
    </section>
  );
}

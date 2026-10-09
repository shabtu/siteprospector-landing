import { OFFER, mailto } from "@/lib/site";

const COPY = {
  title: "Pris",
  vat: `inkl. moms (${OFFER.priceExVat} exkl. moms)`,
  facts: [OFFER.noSetupFee, OFFER.binding],
  includedTitle: "Det här ingår",
  after:
    "Efter 12 månader fortsätter avtalet månad för månad, med en månads uppsägningstid.",
  button: "Fråga om förslaget",
  subject: "Fråga om förslaget på hemsidan",
} as const;

const INCLUDED = [
  "Modern hemsida som fungerar i mobilen",
  "Hosting och SSL-certifikat (https)",
  `Mindre ändringar inom ${OFFER.smallChanges}`,
  "Säkerhetsuppdateringar och underhåll",
  "Support via e-post",
  "Hemsidan på er egen domän",
] as const;

export default function Included() {
  return (
    <section className="section" id="pricing" aria-labelledby="pricing-title">
      <h2 id="pricing-title">{COPY.title}</h2>
      <div className="price-card">
        <p className="price-amount">{OFFER.price}</p>
        <p className="price-vat">{COPY.vat}</p>
        <ul className="price-facts">
          {COPY.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <h3>{COPY.includedTitle}</h3>
        <ul className="checklist">
          {INCLUDED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <a className="btn btn-primary" href={mailto(COPY.subject)}>
          {COPY.button}
        </a>
      </div>
      <p className="after-binding">{COPY.after}</p>
    </section>
  );
}

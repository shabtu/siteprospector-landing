import { OFFER } from "@/lib/site";

const COPY = {
  label: "Pris",
  unit: "/mån",
  vat: `inkl. moms · ${OFFER.priceExVat} exkl. moms`,
  terms: [OFFER.binding, OFFER.noSetupFee, "Förslaget är gratis – ni betalar först när ni säger ja"],
  cta: "Få en gratis analys",
} as const;

export default function PriceCard() {
  return (
    <div className="price-card">
      <div className="price-main">
        <div className="price-label">{COPY.label}</div>
        <div className="price-amount">
          {OFFER.price}
          <span className="unit">{COPY.unit}</span>
        </div>
        <div className="price-note">{COPY.vat}</div>
      </div>
      <div className="price-side">
        <ul className="price-terms">
          {COPY.terms.map((term) => (
            <li key={term}>
              <span className="check">✓</span>
              {term}
            </li>
          ))}
        </ul>
        <a className="btn-primary" href="#cta">
          {COPY.cta} →
        </a>
      </div>
    </div>
  );
}

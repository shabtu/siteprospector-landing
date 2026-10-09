import { OFFER, SITE } from "@/lib/site";

const COPY = {
  title: "Vi bygger ett gratis förslag på er nya hemsida.",
  sub: "Vi utgår från er nuvarande hemsida och ert eget innehåll. Ni får en länk och tittar i lugn och ro.",
  facts: `Förslaget är gratis. Vill ni behålla det kostar det ${OFFER.priceShort}. ${OFFER.noSetupFee}.`,
  primary: "Se ett exempel",
  mail: "Frågor? Mejla",
} as const;

export default function Hero() {
  return (
    <section className="hero">
      <h1>{COPY.title}</h1>
      <p className="lead">{COPY.sub}</p>
      <p className="hero-facts">{COPY.facts}</p>
      <div className="hero-actions">
        <a className="btn btn-primary" href="#example">
          {COPY.primary}
        </a>
        <p>
          {COPY.mail} <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
      </div>
    </section>
  );
}

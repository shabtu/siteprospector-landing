"use client";

import { goToSection } from "@/lib/scroll";

const COPY = {
  eyebrow: "För svenska småföretag",
  sub: "Helt gratis, utan förpliktelse. Vi analyserar er nuvarande hemsida, bygger ett förslag av ert eget innehåll och visar det för er innan vi ber om något.",
  primary: "Få en gratis analys",
  secondary: "Se ett exempel",
  trust: ["Gratis förslag", "Ert eget innehåll", "Ingen startavgift"],
};

export default function Hero() {
  return (
    <section className="hero">
      <div className="eyebrow">
        <span className="dot" />
        {COPY.eyebrow}
      </div>
      <h1 className="hero-title">
        Vi har redan byggt
        <br />
        en <span className="gold">bättre version</span>
        <br />
        av er hemsida.
      </h1>
      <p className="hero-sub">{COPY.sub}</p>
      <div className="hero-cta-row">
        <button className="btn-primary" onClick={() => goToSection("cta")}>
          {COPY.primary} →
        </button>
        <button className="btn-ghost" onClick={() => goToSection("example")}>
          {COPY.secondary}
        </button>
      </div>
      <div className="hero-trust">
        {COPY.trust.map((item) => (
          <span key={item}>
            <span className="check">✓</span> {item}
          </span>
        ))}
      </div>
    </section>
  );
}

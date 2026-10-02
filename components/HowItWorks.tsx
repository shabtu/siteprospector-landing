import { OFFER } from "@/lib/site";

const COPY = {
  label: "Så fungerar det",
  title: "Tre steg. Ni bestämmer själva.",
  sub: "Först analys, sedan förslag, sist ert beslut. Ni binder er inte till något för att se förslaget.",
  steps: [
    {
      num: "STEG 01 — ANALYS",
      title: "Vi analyserar er hemsida",
      desc: "Vi går igenom er nuvarande hemsida som en besökare skulle göra. Framgår det vad ni gör? Är det lätt att ta kontakt? Fungerar den i mobilen? Laddar den snabbt?",
    },
    {
      num: "STEG 02 — FÖRSLAG",
      title: "Vi bygger ett förslag med ert eget innehåll",
      desc: "Vi utgår från texterna, bilderna och uppgifterna på er nuvarande hemsida och bygger en ny, modern version som fungerar lika bra i mobilen som på datorn.",
    },
    {
      num: "STEG 03 — ERT BESLUT",
      title: "Ni bestämmer – inget kostar förrän ni säger ja",
      desc: `Ni får en privat länk till förslaget och kan jämföra det med er nuvarande hemsida. Vill ni behålla det gäller ${OFFER.priceShort}. Annars är det bara att säga nej.`,
    },
  ],
} as const;

export default function HowItWorks() {
  const [analysis, proposal, decision] = COPY.steps;

  return (
    <section className="section">
      <div className="sec-head">
        <div className="sec-label">{COPY.label}</div>
        <h2 className="sec-title">{COPY.title}</h2>
        <p className="sec-sub">{COPY.sub}</p>
      </div>
      <div className="steps">
        <div className="step">
          <div className="step-num">{analysis.num}</div>
          <div className="step-title">{analysis.title}</div>
          <div className="step-desc">{analysis.desc}</div>
          <div className="step-visual">
            <div className="sv-row"><span className="sv-label">Tydligt vad ni gör</span><span className="sv-status pass"><span className="sv-mark">✓</span> Ja</span></div>
            <div className="sv-row"><span className="sv-label">Lätt att ta kontakt</span><span className="sv-status fail"><span className="sv-mark">✗</span> Svårt</span></div>
            <div className="sv-row"><span className="sv-label">Fungerar i mobilen</span><span className="sv-status fail"><span className="sv-mark">✗</span> Brister</span></div>
            <div className="sv-row"><span className="sv-label">Laddningstid</span><span className="sv-status gold">Långsam</span></div>
          </div>
        </div>
        <div className="step">
          <div className="step-num">{proposal.num}</div>
          <div className="step-title">{proposal.title}</div>
          <div className="step-desc">{proposal.desc}</div>
          <div className="step-visual">
            <div className="sv-row"><span className="sv-label">Design</span><span className="sv-status pass"><span className="sv-mark">✓</span> Klar</span></div>
            <div className="sv-row"><span className="sv-label">Texter och bilder</span><span className="sv-status pass"><span className="sv-mark">✓</span> Klar</span></div>
            <div className="sv-row"><span className="sv-label">Mobilversion</span><span className="sv-status gold">Pågår</span></div>
            <div className="sv-row"><span className="sv-label">Slutgranskning</span><span className="sv-status" style={{ color: "var(--color-ink-3)" }}>Därefter</span></div>
            <div className="sv-progress" />
          </div>
        </div>
        <div className="step">
          <div className="step-num">{decision.num}</div>
          <div className="step-title">{decision.title}</div>
          <div className="step-desc">{decision.desc}</div>
          <div className="step-visual">
            <div className="sv-compare">
              <div className="sv-pill bad"><div className="lbl">Er hemsida</div><div className="num">Före</div></div>
              <div className="sv-pill good"><div className="lbl">Vårt förslag</div><div className="num">Efter</div></div>
            </div>
            <div className="sv-choice">
              <div className="sv-btn keep">Ja tack</div>
              <div className="sv-btn">Nej tack</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The example is fiction: the practice, its name, address and phone number are
 * made up, and it says so on the page. Keep it free of figures (ratings,
 * patient counts, results) and of customer quotes.
 */
const CASE = {
  name: "Exempelby Tandvård",
  initial: "E",
  type: "Tandläkarmottagning",
  location: "Exempelby",
  domain: "exempelby-tandvard.se",
  badFindings: [
    {
      title: "Ser okej ut, men byggd 2015 och orörd sedan 2018",
      detail:
        "Stockfoto på en leende familj högst upp, logotyp i Times New Roman och © 2018 i sidfoten. Besökarna märker att sidan inte sköts.",
    },
    {
      title: "Sju menyval utan ordning",
      detail:
        "Hem, Om oss, Vår personal, Behandlingar, Blanketter, Priser, Kontakt – inget som visar vad man ska göra först. Besökaren tvekar.",
    },
    {
      title: "Telefonnumret ligger längst ner, som en bild",
      detail:
        "Det går inte att trycka på i mobilen och inte att kopiera. Det är lätt att missa.",
    },
    {
      title: "”Boka tid” öppnar en PDF-blankett",
      detail:
        "Man skriver ut den, fyller i och lämnar in. Det finns ingen enkel väg att kontakta mottagningen direkt från sidan.",
    },
    {
      title: "Fungerar dåligt i mobilen",
      detail:
        "Texten går utanför skärmen, knapparna är för små för att trycka på och startbilden förstör layouten.",
    },
    {
      title: "Textvägg utan något som skapar förtroende",
      detail:
        "Tre stycken om personalens utbildning. Inga omdömen, ingen karta, inga öppettider i klartext. Sidan laddar långsamt.",
    },
  ],
  goodFindings: [
    {
      title: "En tydlig rubrik och ett tydligt nästa steg",
      detail:
        "”Trygg tandvård för hela familjen.” Under rubriken finns en knapp för att boka tid eller ringa, så ingen behöver gissa vad man ska göra.",
    },
    {
      title: "Telefonnumret högst upp – ett tryck för att ringa",
      detail: "Alltid synligt och klickbart. I mobilen ringer det direkt när man trycker på det.",
    },
    {
      title: "Förtroende där blicken hamnar först",
      detail:
        "Öppettider, adress och uppgifter om mottagningen och personalen – hämtade från er egen hemsida och synliga direkt.",
    },
    {
      title: "Behandlingarna som tydliga kort",
      detail:
        "Undersökning, tandblekning, tandreglering och akut tandvård – varje kort leder till rätt information.",
    },
    {
      title: "Karta och öppettider på samma sida",
      detail: "Besökaren ser var ni finns och när ni har öppet utan att behöva leta.",
    },
    {
      title: "Byggd för mobilen först",
      detail: "Stora knappar, text som ryms på skärmen och snabb att ladda. Fungerar lika bra på datorn.",
    },
  ],
} as const;

const COPY = {
  label: "Exempel",
  titleLines: ["En tandläkare.", "Samma mottagning, två hemsidor."],
  sub: "Så kan ett förslag se ut. Mottagningen är påhittad. Till vänster en hemsida som ser okej ut men är svår att använda, till höger samma innehåll i en tydligare och mobilanpassad version.",
  fiction: "Fiktivt exempel",
  before: { tag: "Före", note: "Ser okej ut, men är svår att använda", findings: "Det här hittade vi" },
  after: { tag: "Efter · vårt förslag", note: "Samma innehåll, tydligare upplägg", findings: "Så löser förslaget det" },
} as const;

function BeforeMock() {
  return (
    <div className="mock-before">
      <div className="mb-top">
        <span>Välkommen till Exempelby Tandvård!</span>
        <span>Sitemap | Skriv ut sidan</span>
      </div>
      <div className="mb-head">
        <div className="mb-logo">Exempelby Tandvård AB</div>
        <div className="mb-tag">Din tandläkare i Exempelby sedan 2008</div>
      </div>
      <div className="mb-nav">
        <span>Hem</span><span>Om oss</span><span>Vår personal</span><span>Behandlingar</span>
        <span>Blanketter</span><span>Priser</span><span>Kontakt</span>
      </div>
      <div className="mb-body">
        <div className="mb-stock">
          <div className="mb-stock-ph">
            <span className="mb-people">👨‍👩‍👧‍👦</span>
            <span className="mb-stock-cap">[ stockfoto: leende familj ]</span>
          </div>
        </div>
        <div className="mb-text">
          <h3>Välkommen till vår mottagning</h3>
          <p>
            Tandläkare Anna Exempelsson med personal har i många år erbjudit allsidig tandvård till
            familjer i Exempelby med omnejd. Vi är stolta över att kunna erbjuda...
          </p>
          <p>
            Vår personal arbetar för att ditt besök ska bli bekvämt och trevligt. Läs gärna mer på
            vår hemsida om våra behandlingar, personalens utbildning och...
          </p>
          <p>
            <a className="mb-link">→ Klicka här för att ladda ner Nypatientblankett (PDF)</a>
          </p>
          <p>
            <a className="mb-link">→ Boka tid: klicka här för att ladda ner blanketten (PDF)</a>
          </p>
        </div>
      </div>
      <div className="mb-announce">
        <strong>Nyheter:</strong>
        <span>Vi tar emot nya patienter! Ring för att boka ditt första besök.</span>
      </div>
      <div className="mb-services-row">
        <span><strong>Våra behandlingar:</strong></span>
        <span>Allmäntandvård</span><span className="sep">|</span>
        <span>Tandstensborttagning</span><span className="sep">|</span>
        <span>Tandblekning</span><span className="sep">|</span>
        <span>Kronor &amp; broar</span>
      </div>
      <div className="mb-foot">
        <span>© 2018 Exempelby Tandvård AB. Alla rättigheter förbehållna.</span>
        <span className="mb-phone-img">[ telefonnummer som bild ]</span>
      </div>
    </div>
  );
}

function AfterMock() {
  return (
    <div className="mock-after">
      <div className="ma-topbar">
        <span>📍 Exempelby · Öppet i dag till 17</span>
        <span><strong>Nya patienter är välkomna</strong></span>
      </div>
      <div className="ma-nav">
        <div className="ma-logo">
          <span className="lmark">E</span>
          Exempelby Tandvård
        </div>
        <div className="ma-nav-links">
          <span>Behandlingar</span><span>Om oss</span><span>Hitta hit</span>
        </div>
        <div className="ma-phone">📞 08-000 00 00</div>
      </div>
      <div className="ma-hero">
        <div className="ma-hero-text">
          <div className="ma-eyebrow">Tandläkare i Exempelby</div>
          <div className="ma-h1">
            Trygg tandvård för <span className="accent">hela familjen.</span>
          </div>
          <div className="ma-sub">
            Här hittar du våra behandlingar, öppettider och hur du bokar tid. Vi tar emot nya
            patienter.
          </div>
          <div className="ma-cta-row">
            <span className="ma-btn">Boka tid →</span>
            <span className="ma-btn-ghost">Möt teamet</span>
          </div>
          <div className="ma-trust">
            <div className="ma-trust-item"><strong>Öppet i dag</strong><span>till 17</span></div>
            <div className="ma-trust-sep" />
            <div className="ma-trust-item"><strong>Ring oss</strong><span>ett tryck</span></div>
            <div className="ma-trust-sep" />
            <div className="ma-trust-item"><strong>Hitta hit</strong><span>karta</span></div>
          </div>
        </div>
        <div className="ma-portrait">
          <div className="ma-portrait-cap">[ ert eget foto ]</div>
        </div>
      </div>
      <div className="ma-services">
        <div className="ma-card"><div className="ma-card-icon">🦷</div><div className="ttl">Undersökning</div><div className="sub">Boka tid</div></div>
        <div className="ma-card"><div className="ma-card-icon">✨</div><div className="ttl">Tandblekning</div><div className="sub">Läs mer</div></div>
        <div className="ma-card"><div className="ma-card-icon">😊</div><div className="ttl">Tandreglering</div><div className="sub">Läs mer</div></div>
        <div className="ma-card"><div className="ma-card-icon">🚑</div><div className="ttl">Akut tandvård</div><div className="sub">Ring oss</div></div>
      </div>
      <div className="ma-foot-row">
        <div className="ma-hours">
          <div className="ttl">Öppettider</div>
          <div className="txt">Måndag–fredag 08–17</div>
          <div className="note">Lördag–söndag stängt</div>
        </div>
        <div className="ma-map">
          <div className="ma-map-grid" />
          <div className="ma-map-pin">◉</div>
          <div className="ma-map-label">Storgatan 1</div>
        </div>
      </div>
    </div>
  );
}

export default function Example() {
  return (
    <section className="section" id="example">
      <div className="sec-head">
        <div className="sec-label">{COPY.label}</div>
        <h2 className="sec-title">
          {COPY.titleLines[0]}
          <br />
          {COPY.titleLines[1]}
        </h2>
        <p className="sec-sub">{COPY.sub}</p>
      </div>

      <div className="case-wrap">
        <div className="case-header">
          <div className="case-avatar">{CASE.initial}</div>
          <div className="case-id">
            <div className="biz">{CASE.name}</div>
            <div className="meta">
              <span>{CASE.type}</span>
              <span className="dot-sep">·</span>
              <span>{CASE.location}</span>
            </div>
          </div>
          <span className="pill case-flag">{COPY.fiction}</span>
        </div>

        <div className="case-body">
          <div className="case-side">
            <div className="case-side-head">
              <span className="case-tag before">{COPY.before.tag}</span>
              <span className="case-side-note">{COPY.before.note}</span>
            </div>
            <div className="browser">
              <div className="browser-bar">
                <span className="dot-b" /><span className="dot-b" /><span className="dot-b" />
                <div className="url">⚠ http://{CASE.domain}</div>
              </div>
              <div className="browser-body">
                <BeforeMock />
              </div>
            </div>
            <div className="ex-findings">
              <h4>{COPY.before.findings} · {CASE.badFindings.length} saker att förbättra</h4>
              {CASE.badFindings.map((f) => (
                <div key={f.title} className="finding bad">
                  <div className="finding-icon">✗</div>
                  <div className="finding-text">
                    {f.title}
                    <span className="detail">{f.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="case-side">
            <div className="case-side-head">
              <span className="case-tag after">{COPY.after.tag}</span>
              <span className="case-side-note">{COPY.after.note}</span>
            </div>
            <div className="browser">
              <div className="browser-bar">
                <span className="dot-b" /><span className="dot-b" /><span className="dot-b" />
                <div className="url">🔒 https://{CASE.domain}</div>
              </div>
              <div className="browser-body">
                <AfterMock />
              </div>
            </div>
            <div className="ex-findings">
              <h4>{COPY.after.findings}</h4>
              {CASE.goodFindings.map((f) => (
                <div key={f.title} className="finding good">
                  <div className="finding-icon">✓</div>
                  <div className="finding-text">
                    {f.title}
                    <span className="detail">{f.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

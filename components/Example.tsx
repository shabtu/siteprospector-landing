/**
 * The example is fiction: the practice and its name are made up, and the page
 * says so. Keep it free of figures (ratings, patient counts, results), phone
 * numbers and customer quotes.
 */
const COPY = {
  title: "Ett exempel",
  note: "Exemplet är påhittat. Mottagningen finns inte.",
  before: {
    tag: "Före",
    label: "Gammal hemsida, påhittad tandläkarmottagning",
    problemsTitle: "Det här hittade vi",
    problems: [
      "Telefonnumret är en bild längst ner.",
      "”Boka tid” är en PDF att skriva ut.",
      "Texten går utanför skärmen i mobilen.",
    ],
  },
  after: {
    tag: "Efter",
    label: "Förslag på ny hemsida, samma påhittade mottagning",
    fixesTitle: "Så löser förslaget det",
    fixes: [
      "Knappar för att boka och ringa finns högst upp.",
      "Öppettider står i klartext.",
      "Text och knappar ryms i mobilen.",
    ],
  },
} as const;

function BeforeMock() {
  return (
    <div className="mock mock-before" role="img" aria-label={COPY.before.label}>
      <div className="mock-logo">Exempelby Tandvård AB</div>
      <div className="mock-menu">Hem | Om oss | Vår personal | Behandlingar | Blanketter | Priser | Kontakt</div>
      <div className="mock-photo">[ stockfoto: leende familj ]</div>
      <div className="mock-link">Klicka här för att ladda ner blanketten (PDF)</div>
      <div className="mock-foot">© 2018 Exempelby Tandvård AB</div>
    </div>
  );
}

function AfterMock() {
  return (
    <div className="mock mock-after" role="img" aria-label={COPY.after.label}>
      <div className="mock-bar">Exempelby Tandvård</div>
      <div className="mock-headline">Trygg tandvård för hela familjen</div>
      <div className="mock-buttons">
        <span className="mock-btn">Boka tid</span>
        <span className="mock-btn mock-btn-alt">Ring oss</span>
      </div>
      <div className="mock-hours">Öppet måndag–fredag 08–17</div>
    </div>
  );
}

export default function Example() {
  return (
    <section className="section" id="example" aria-labelledby="example-title">
      <h2 id="example-title">{COPY.title}</h2>
      <p>{COPY.note}</p>
      <div className="example">
        <div className="example-col">
          <p className="example-tag tag-before">{COPY.before.tag}</p>
          <BeforeMock />
          <h3>{COPY.before.problemsTitle}</h3>
          <ul className="marklist marklist-bad">
            {COPY.before.problems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="example-col">
          <p className="example-tag tag-after">{COPY.after.tag}</p>
          <AfterMock />
          <h3>{COPY.after.fixesTitle}</h3>
          <ul className="marklist marklist-good">
            {COPY.after.fixes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

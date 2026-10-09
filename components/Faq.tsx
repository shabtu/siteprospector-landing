import { OFFER } from "@/lib/site";

const COPY = {
  title: "Vanliga frågor",
} as const;

/** Keep the answers in line with the contract (templates/avtal.md in the pipeline repo). */
const FAQ = [
  {
    q: "Vad kostar förslaget?",
    a: [
      "Ingenting. Vi bygger förslaget gratis och ni förbinder er inte till något.",
      `Ni betalar först om ni väljer att behålla det. Då gäller ${OFFER.priceShort} och ${OFFER.binding.toLowerCase()}. ${OFFER.noSetupFee}.`,
    ],
  },
  {
    q: "Hur länge finns förslaget?",
    a: [
      `Länken gäller i ${OFFER.proposalDays} om vi inte är i dialog. Vill ni att vi tar bort förslaget direkt, säg till så gör vi det.`,
    ],
  },
  {
    q: "Hur gör vi ändringar?",
    a: [
      `Ni mejlar oss vad som ska ändras, till exempel nya öppettider. Mindre ändringar gör vi inom ${OFFER.smallChanges} efter att ni har skrivit till oss.`,
      "Större ändringar, som ny design, många nya sidor eller nya funktioner, offererar vi separat. Webbshop och bokningssystem ingår inte.",
    ],
  },
  {
    q: "Behåller vi vår domän och vår e-post?",
    a: [
      "Ja. Domänen är er, och vi rör aldrig er e-post. Innan hemsidan publiceras går vi igenom domänen tillsammans med er.",
      "Er gamla hemsida och ert webbhotell ligger kvar tills ni själva avslutar dem.",
    ],
  },
  {
    q: "Vad händer efter 12 månader?",
    a: [
      "Vill ni sluta när bindningstiden är slut, säger ni upp avtalet per e-post senast en månad innan. Annars fortsätter det månad för månad, med en månads uppsägningstid.",
      "Det fullständiga avtalet ser ni innan ni säger ja.",
    ],
  },
] as const;

export default function Faq() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">{COPY.title}</h2>
      <div className="faq-list">
        {FAQ.map((item) => (
          <details className="faq-item" key={item.q}>
            <summary>{item.q}</summary>
            <div className="faq-answer">
              {item.a.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

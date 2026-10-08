import { OFFER } from "@/lib/site";

const COPY = {
  label: "Vanliga frågor",
  title: "Frågor och svar",
} as const;

/** Keep the answers in line with the contract (templates/avtal.md in the pipeline repo). */
const FAQ = [
  {
    q: "Vad kostar förslaget?",
    a: [
      "Ingenting. Vi analyserar er hemsida och bygger förslaget gratis och utan förpliktelse.",
      `Ni betalar först om ni väljer att behålla det. Då gäller ${OFFER.priceShort}, ${OFFER.binding} och ${OFFER.noSetupFee.toLowerCase()}.`,
    ],
  },
  {
    q: "Hur gör vi ändringar?",
    a: [
      `Ni mejlar oss vad som ska ändras – nya öppettider, en ny meny, en ny medarbetare – så uppdaterar vi hemsidan. Mindre ändringar gör vi inom ${OFFER.smallChanges}.`,
      "Större omarbetningar, till exempel ny design eller nya funktioner, offererar vi separat. Webbshop och bokningssystem ingår inte.",
    ],
  },
  {
    q: "Behåller vi vår domän?",
    a: [
      "Ja. Domännamnet är ert och ligger kvar hos det företag där ni köpt det. Vi skickar en enkel instruktion för hur ni pekar om adressen till den nya hemsidan.",
      "Er gamla hemsida och ert webbhotell rör vi inte. Det säger ni upp själva när det passar er.",
    ],
  },
  {
    q: "Påverkas vår e-post?",
    a: [
      "Nej. Vi ändrar bara vart hemsidans adress pekar. Era e-postinställningar lämnar vi orörda, så brevlådorna fungerar som vanligt hos den leverantör ni har i dag.",
    ],
  },
  {
    q: "Vad händer efter 12 månader?",
    a: [
      "Bindningstiden är tolv månader. Vill ni sluta när den har gått säger ni upp avtalet per e-post senast en månad innan. Annars fortsätter det månad för månad, med en månads uppsägningstid.",
      "Om ni väljer att sluta får ni en kopia av hemsidans filer och instruktioner för att flytta den. Det fullständiga avtalet ser ni innan ni säger ja.",
    ],
  },
] as const;

export default function Faq() {
  return (
    <section className="section" id="faq">
      <div className="sec-head">
        <div className="sec-label">{COPY.label}</div>
        <h2 className="sec-title">{COPY.title}</h2>
      </div>
      <div className="faq-list">
        {FAQ.map((item, index) => (
          <details className="faq-item" key={item.q} open={index === 0}>
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

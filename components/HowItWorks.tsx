const COPY = {
  title: "Så fungerar det",
  steps: [
    {
      title: "Vi tittar på er hemsida",
      text: "Vi går igenom den som en besökare skulle göra, i telefonen och på datorn.",
    },
    {
      title: "Vi bygger ett förslag",
      text: "Vi använder texter och bilder från er egen hemsida och mejlar en länk. Det är gratis.",
    },
    {
      title: "Ni bestämmer",
      text: "Vill ni gå vidare skickar vi priset och hela avtalet. Annars säger ni bara nej.",
    },
  ],
} as const;

export default function HowItWorks() {
  return (
    <section className="section" id="how" aria-labelledby="how-title">
      <h2 id="how-title">{COPY.title}</h2>
      <ol className="steps">
        {COPY.steps.map((step, index) => (
          <li key={step.title}>
            <span className="step-num" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

import { COMPANY, SITE } from "@/lib/site";

const COPY = {
  title: "Hör av er",
  text: "Har ni fått ett mejl från oss, eller vill ni veta mer? Skriv till oss, så svarar vi.",
  button: "Mejla oss",
  subject: "Fråga om förslaget på hemsidan",
} as const;

export default function Contact() {
  const href = `mailto:${SITE.email}?subject=${encodeURIComponent(COPY.subject)}`;

  return (
    <section className="section contact" id="contact">
      <h2 className="sec-title">{COPY.title}</h2>
      <p className="sec-sub">{COPY.text}</p>
      <p className="contact-mail">
        <a href={href}>{SITE.email}</a>
      </p>
      <a className="btn-primary" href={href}>
        {COPY.button}
      </a>
      <p className="contact-company">
        {COMPANY.name}
        <br />
        Org.nr {COMPANY.orgNr}
        <br />
        {COMPANY.address}
      </p>
    </section>
  );
}

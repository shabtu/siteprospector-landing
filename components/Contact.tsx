import { COMPANY, SITE, mailto } from "@/lib/site";

const COPY = {
  title: "Hör av er",
  text: "Har ni fått ett mejl från oss, eller vill ni veta mer? Skriv till oss, så svarar vi.",
  button: "Mejla oss",
  subject: "Fråga om förslaget på hemsidan",
} as const;

export default function Contact() {
  const href = mailto(COPY.subject);

  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title">{COPY.title}</h2>
      <p>{COPY.text}</p>
      <p className="contact-mail">
        <a href={href}>{SITE.email}</a>
      </p>
      <a className="btn btn-primary" href={href}>
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

import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export const metadata: Metadata = { title: "Sidan finns inte" };

const COPY = {
  label: "404",
  title: "Sidan finns inte",
  text: "Adressen stämmer inte, eller så har sidan flyttats. Gå tillbaka till startsidan så hittar ni rätt.",
  back: "Till startsidan",
} as const;

export default function NotFound() {
  return (
    <div className="shell">
      <Nav />
      <main className="page shell-main">
        <section className="not-found">
          <div className="sec-label">{COPY.label}</div>
          <h1 className="sec-title">{COPY.title}</h1>
          <p className="sec-sub">{COPY.text}</p>
          <Link className="btn-primary" href="/">
            {COPY.back}
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

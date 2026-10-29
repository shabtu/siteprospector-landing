import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Example from "@/components/Example";
import Included from "@/components/Included";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import ScoreCheck from "@/components/ScoreCheck";
import { TURNSTILE_SITE_KEY } from "@/lib/score";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="page">
        <Hero />
        {/* The score section is on the page only once the score API and its Turnstile key exist (DEPLOY.md). */}
        {TURNSTILE_SITE_KEY && <ScoreCheck />}
        <HowItWorks />
        <Example />
        <Included />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

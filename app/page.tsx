import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Example from "@/components/Example";
import Included from "@/components/Included";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="page">
        <Hero />
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

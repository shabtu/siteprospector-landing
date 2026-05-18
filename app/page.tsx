import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AuditShowcase from "@/components/AuditShowcase";
import HowItWorks from "@/components/HowItWorks";
import Example from "@/components/Example";
import Included from "@/components/Included";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="page">
        <Hero />
      </div>
      <div className="page">
        <AuditShowcase />
      </div>
      <div id="how" className="page">
        <HowItWorks />
      </div>
      <div className="page">
        <Example />
      </div>
      <div id="pricing" className="page">
        <Included />
      </div>
      <CTA />
      <Footer />
    </>
  );
}

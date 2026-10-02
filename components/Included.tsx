import PriceCard from "@/components/PriceCard";
import { OFFER } from "@/lib/site";

const COPY = {
  label: "Det här ingår",
  title: `Det här får ni för ${OFFER.price} i månaden.`,
  sub: "Ett fast pris, ingen startavgift. Förslaget bygger vi gratis – ni betalar först när ni säger ja.",
} as const;

const INCLUDED = [
  {
    num: "01",
    title: "Modern, mobilanpassad hemsida",
    desc: "Byggd på texter, bilder och uppgifter från er nuvarande hemsida. Fungerar lika bra i mobilen som på datorn.",
  },
  {
    num: "02",
    title: "Snabb hosting",
    desc: "Vi sköter servern och driften, så att hemsidan laddar snabbt för era besökare.",
  },
  {
    num: "03",
    title: "SSL-certifikat",
    desc: "Säker anslutning (https), så att webbläsaren inte varnar era besökare. Vi sköter certifikatet.",
  },
  {
    num: "04",
    title: "Ändringar och uppdateringar",
    desc: `Nya öppettider, ny meny eller ny personal? Mejla oss. Mindre ändringar gör vi inom ${OFFER.smallChanges}. Större omarbetningar offereras separat.`,
  },
  {
    num: "05",
    title: "Support via e-post och telefon",
    desc: "Ni når oss på e-post och telefon när något är oklart eller inte fungerar.",
  },
  {
    num: "06",
    title: "Er domän och e-post berörs inte",
    desc: "Domännamnet är och förblir ert. Er e-post fortsätter fungera som i dag.",
  },
] as const;

export default function Included() {
  return (
    <section className="section">
      <div className="sec-head">
        <div className="sec-label">{COPY.label}</div>
        <h2 className="sec-title">{COPY.title}</h2>
        <p className="sec-sub">{COPY.sub}</p>
      </div>
      <div className="included-grid">
        {INCLUDED.map((item) => (
          <div className="inc-item" key={item.num}>
            <span className="inc-num">{item.num}</span>
            <div className="inc-text">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
            <span className="inc-check">✓</span>
          </div>
        ))}
      </div>
      <PriceCard />
    </section>
  );
}

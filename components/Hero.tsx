"use client";

export default function Hero() {
  const scrollTo = (id: string) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="eyebrow">
        <span className="dot" />
        Free audit · No signup
      </div>
      <h1 className="hero-title">
        We audited your website.
        <br />
        It scored <span className="gold">38/100</span>.
        <br />
        We already built a better version.
      </h1>
      <p className="hero-sub">
        Site Prospector finds exactly why your website is losing customers — then we rebuild it for
        you. You only pay if you want to keep it. No sales calls. No commitments.
      </p>
      <div className="hero-cta-row">
        <button className="btn-primary" onClick={scrollTo("cta")}>
          Get started →
        </button>
        <button className="btn-ghost" onClick={scrollTo("example")}>
          View an example
        </button>
      </div>
      <div className="hero-trust">
        <span>
          <span className="check">✓</span> 60-second audit
        </span>
        <span>
          <span className="check">✓</span> Free rebuild
        </span>
        <span>
          <span className="check">✓</span> No contract
        </span>
      </div>
    </section>
  );
}

"use client";

export default function Nav() {
  const scrollTo = (id: string) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="nav">
      <div className="page nav-inner">
        <div className="logo">
          <div className="logo-mark" />
          Site Prospector
        </div>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#example">Example</a>
          <a href="#pricing">Pricing</a>
          <button className="nav-cta" onClick={scrollTo("cta")}>
            Get started
          </button>
        </div>
        <button className="nav-cta nav-cta-mobile" onClick={scrollTo("cta")}>
          Get started
        </button>
      </div>
    </nav>
  );
}

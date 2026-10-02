"use client";

import Link from "next/link";
import { goToSection } from "@/lib/scroll";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/#how", label: "Så fungerar det" },
  { href: "/#example", label: "Exempel" },
  { href: "/#pricing", label: "Pris" },
  { href: "/#faq", label: "Vanliga frågor" },
];

const CTA_LABEL = "Gratis analys";

export default function Nav() {
  return (
    <nav className="nav" aria-label="Huvudmeny">
      <div className="page nav-inner">
        <Link className="logo" href="/">
          <div className="logo-mark" />
          {SITE.name}
        </Link>
        <div className="nav-links">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <button className="nav-cta" onClick={() => goToSection("cta")}>
            {CTA_LABEL}
          </button>
        </div>
        <button className="nav-cta nav-cta-mobile" onClick={() => goToSection("cta")}>
          {CTA_LABEL}
        </button>
      </div>
    </nav>
  );
}

import Link from "next/link";
import { SITE, mailto } from "@/lib/site";

const LINKS = [
  { href: "/#how", label: "Så fungerar det" },
  { href: "/#example", label: "Exempel" },
  { href: "/#pricing", label: "Pris" },
  { href: "/#faq", label: "Frågor" },
];

export default function Nav() {
  return (
    <nav className="nav" aria-label="Huvudmeny">
      <div className="page nav-inner">
        <Link className="logo" href="/">
          <span className="logo-mark" aria-hidden="true" />
          {SITE.name}
        </Link>
        <div className="nav-links">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <a className="btn btn-primary btn-small" href={mailto("Fråga om förslaget på hemsidan")}>
          Mejla oss
        </a>
      </div>
    </nav>
  );
}

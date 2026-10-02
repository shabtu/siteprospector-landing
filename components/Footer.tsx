import Link from "next/link";
import { COMPANY, SITE } from "@/lib/site";

const LEGAL_LINKS = [
  { href: "/integritet", label: "Integritetspolicy" },
  { href: "/villkor", label: "Villkor" },
];

const LEGAL_LINE = `${SITE.name} drivs av ${COMPANY.name} · org.nr ${COMPANY.orgNr} · ${COMPANY.address}`;

export default function Footer() {
  return (
    <footer>
      <div className="page">
        <div className="foot">
          <div className="foot-l">
            <div className="logo">
              <div className="logo-mark" />
              {SITE.name}
            </div>
          </div>
          <div className="foot-r">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="foot-legal">{LEGAL_LINE}</div>
      </div>
    </footer>
  );
}

/** Facts about the business that appear in more than one place. */
export const SITE = {
  name: "Site Prospector",
  url: "https://siteprospector.com",
  email: "simon@siteprospector.com",
} as const;

export const COMPANY = {
  name: "Habtu Consulting AB",
  orgNr: "559333-3015",
  address: "Prästgårdsgatan 2, 172 32 Sundbyberg",
} as const;

/**
 * The offer. The source is docs/offer-facts.md in the pipeline repo; only what
 * it marks "Beslutat" may be stated here as fixed. Keep in line with the
 * contract (templates/avtal.md).
 */
export const OFFER = {
  price: "695 kr",
  priceExVat: "556 kr",
  priceShort: "695 kr/mån inkl. moms",
  binding: "12 månaders bindningstid",
  noSetupFee: "Ingen startavgift",
  smallChanges: "två arbetsdagar",
  proposalDays: "60 dagar",
} as const;

/** The mailto link used for every "mail us" button. */
export function mailto(subject: string): string {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
}

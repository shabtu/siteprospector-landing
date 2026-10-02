/** Facts about the business that appear in more than one place. */
export const SITE = {
  name: "Site Prospector",
  url: "https://siteprospector.com",
  email: "simon@siteprospector.com",
} as const;

/** The offer. Keep in line with the contract (templates/avtal.md in the pipeline repo). */
export const OFFER = {
  price: "695 kr",
  priceExVat: "556 kr",
  priceShort: "695 kr/mån inkl. moms",
  binding: "12 månaders bindningstid",
  noSetupFee: "Ingen startavgift",
  smallChanges: "två arbetsdagar",
} as const;

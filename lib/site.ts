/** Facts about the business that appear in more than one place. */
export const SITE = {
  name: "Site Prospector",
  url: "https://siteprospector.com",
  email: "simon@siteprospector.com",
} as const;

/** The offer. Keep in line with the contract (templates/avtal.md in the pipeline repo). */
export const OFFER = {
  pitch: "Vi har redan byggt en bättre version av er hemsida – helt gratis, utan förpliktelse.",
  price: "695 kr",
  priceUnit: "per månad inkl. moms",
  priceShort: "695 kr/mån inkl. moms",
  binding: "12 månaders bindningstid",
  noSetupFee: "Ingen startavgift",
} as const;

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { OFFER, SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

const TITLE = `${SITE.name} – vi bygger ett gratis förslag på er hemsida`;
const DESCRIPTION = `Vi analyserar er hemsida och bygger ett förslag med ert eget innehåll – helt gratis, utan förpliktelse. Vill ni behålla förslaget kostar det ${OFFER.priceShort}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: TITLE, template: `%s – ${SITE.name}` },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: SITE.name,
    locale: "sv_SE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}

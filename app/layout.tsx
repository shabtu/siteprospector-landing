import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Site Prospector — We audited your website. We already built a better one.",
  description:
    "Site Prospector audits your small business website, shows exactly why it's losing customers, and rebuilds it for you — free. You only pay if you keep it.",
  metadataBase: new URL("https://siteprospector.com"),
  openGraph: {
    title: "Site Prospector",
    description: "We audited your website. We already built a better version.",
    url: "https://siteprospector.com",
    siteName: "Site Prospector",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}

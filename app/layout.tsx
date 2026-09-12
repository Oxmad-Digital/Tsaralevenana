import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteInfo } from "@/lib/data";
import { heroUrl, faviconDarkUrl, faviconLightUrl } from "@/lib/images";
import PageViewTracker from "@/components/PageViewTracker";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const title =
  "Maison Funéraire Tsaralevenana | Pompes Funèbres à Antananarivo";
const description =
  "Maison Funéraire Tsaralevenana à Antananarivo : espace de veillée, crémation, service traiteur et rapatriement de corps vers Madagascar. Joignables 24h/24. Contactez-nous.";

export const metadata: Metadata = {
  metadataBase: new URL(siteInfo.url),
  title: {
    default: title,
    template: `%s | ${siteInfo.tagline} ${siteInfo.name}`,
  },
  description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: faviconLightUrl, media: "(prefers-color-scheme: light)" },
      { url: faviconDarkUrl, media: "(prefers-color-scheme: dark)" },
    ],
  },
  openGraph: {
    title,
    description,
    url: siteInfo.url,
    siteName: siteInfo.name,
    locale: "fr_MG",
    type: "website",
    images: [{ url: heroUrl, width: 2000, height: 1124, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [heroUrl],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "FuneralHome",
  name: `${siteInfo.tagline} ${siteInfo.name}`,
  url: siteInfo.url,
  image: heroUrl,
  telephone: siteInfo.phoneHref.replace("tel:", ""),
  email: siteInfo.email,
  description,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteInfo.city,
    addressCountry: "MG",
  },
  areaServed: {
    "@type": "City",
    name: siteInfo.city,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <a href="#contenu" className="skipLink">
          Aller au contenu
        </a>
        <PageViewTracker />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
      </body>
      <GoogleAnalytics gaId="G-V4EYM36Y1F" />
    </html>
  );
}

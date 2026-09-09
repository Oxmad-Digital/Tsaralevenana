import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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

export const metadata: Metadata = {
  title: "Maison Funéraire Tsaralevenana | Antananarivo",
  description:
    "Présent à vos côtés, dans chaque étape du deuil. Organisation des obsèques, rapatriement, crémation et accompagnement à Antananarivo, Madagascar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-V4EYM36Y1F" />
    </html>
  );
}

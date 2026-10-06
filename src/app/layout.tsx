import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

// Türkçe harfler (ğ, ş, ı, İ) latin-ext alt kümesinde.
const plexSans = IBM_Plex_Sans({ variable: "--font-plex-sans", subsets: ["latin", "latin-ext"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Tezgâh — Atölyeler için dijital iş takibi",
  description:
    "Küçük üretim atölyelerinde işleri defterden çıkarıp tek ekrandan takip edin. Ön görüşme talebi bırakın.",
};

export const viewport: Viewport = {
  themeColor: "#f6f2eb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${plexSans.variable} ${fraunces.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-murekkep"
        >
          İçeriğe geç
        </a>
        {children}
      </body>
    </html>
  );
}

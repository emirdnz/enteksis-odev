import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// Türkçe harfler (ğ, ş, ı, İ) latin-ext alt kümesinde.
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Tezgâh — Atölyeler için dijital iş takibi",
  description:
    "Küçük üretim atölyelerinde işleri defterden çıkarıp tek ekrandan takip edin. Ön görüşme talebi bırakın.",
};

export const viewport: Viewport = {
  themeColor: "#fafaf9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-stone-900"
        >
          İçeriğe geç
        </a>
        {children}
      </body>
    </html>
  );
}

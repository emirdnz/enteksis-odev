"use client";

import { useSyncExternalStore } from "react";

// Sağ altta sabit "Başa dön" düğmesi: sayfa aşağı kaydırılınca belirir.
// Tıklama tarayıcının kendi bağlantı davranışı: en üste gider, odak içeriğin başına geçer.
// Görünmezken (visibility: hidden) sekme sırasına ve ekran okuyucuya girmez.

function abone(bildir: () => void) {
  window.addEventListener("scroll", bildir, { passive: true });
  return () => window.removeEventListener("scroll", bildir);
}

const asagida = () => window.scrollY > 600;
const sunucuda = () => false;

export default function BasaDon() {
  const gorunur = useSyncExternalStore(abone, asagida, sunucuda);
  return (
    <a
      href="#icerik"
      aria-label="Başa dön"
      className={`fixed right-4 bottom-4 z-30 flex size-12 items-center justify-center rounded-full bg-lacivert text-white shadow-lg hover:bg-vurgu motion-safe:transition-all sm:right-6 sm:bottom-6 ${
        gorunur ? "opacity-100" : "pointer-events-none invisible translate-y-3 opacity-0"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </a>
  );
}

import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

// Kurgusal test verisi.
export const ORNEK = {
  isim: "Deneme Atölyesi",
  eposta: "deneme@ornek.com",
  hizmetEtiketi: /Defterden aktarım/,
  hizmet: "aktarim",
  aciklama: "Siparişleri defterde tutuyoruz, hangi işin nerede olduğunu göremiyoruz.",
};

export function alanlar(page: Page) {
  return {
    isim: page.getByLabel("Adınız soyadınız"),
    eposta: page.getByLabel("E-posta adresiniz"),
    hizmet: (ad: RegExp) => page.getByRole("radio", { name: ad }),
    aciklama: page.getByLabel("Atölyenizi ve ihtiyacınızı kısaca anlatın"),
    gonder: page.getByRole("button", { name: /Talebi gönder|Gönderiliyor/ }),
    // Next.js'in sayfa geçiş duyurucusu da role="alert" taşır; formdakiyle sınırlanır.
    uyari: page.locator("form").getByRole("alert"),
    basari: page.getByRole("region", { name: "Talebiniz kaydedildi" }),
  };
}

export async function formuDoldur(page: Page) {
  const a = alanlar(page);
  await a.isim.fill(ORNEK.isim);
  await a.eposta.fill(ORNEK.eposta);
  await a.hizmet(ORNEK.hizmetEtiketi).check();
  await a.aciklama.fill(ORNEK.aciklama);
}

export async function erisilebilirlikDenetle(page: Page) {
  const sonuc = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const ozet = sonuc.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
  expect(ozet).toEqual([]);
}

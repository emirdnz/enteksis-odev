import { expect, test } from "@playwright/test";
import { ORNEK, alanlar, formuDoldur } from "./yardimci";

// Gerçek sunucu, ulaşılamayan bir veritabanı adresiyle çalışır (playwright.config.ts).
// Böylece "veritabanı yazamazsa başarı gösterilmez" kuralı uçtan uca sınanır.

const gecerli = {
  isim: ORNEK.isim,
  eposta: ORNEK.eposta,
  hizmet: ORNEK.hizmet,
  aciklama: ORNEK.aciklama,
};

test("GET /api/basvuru → 405", async ({ request }) => {
  const y = await request.get("/api/basvuru");
  expect(y.status()).toBe(405);
});

test("geçersiz veri sunucuda da reddedilir → 422", async ({ request }) => {
  const y = await request.post("/api/basvuru", { data: { ...gecerli, hizmet: "erp", aciklama: "kısa" } });
  expect(y.status()).toBe(422);
  const g = await y.json();
  expect(g.durum).toBe("hata");
  expect(Object.keys(g.alanlar).sort()).toEqual(["aciklama", "hizmet"]);
});

test("JSON olmayan gönderim → 415", async ({ request }) => {
  const y = await request.post("/api/basvuru", { form: gecerli });
  expect(y.status()).toBe(415);
});

test("veritabanına yazılamazsa → 500, başarı yok, iç hata sızmaz", async ({ request }) => {
  const y = await request.post("/api/basvuru", { data: gecerli });
  expect(y.status()).toBe(500);
  const metin = await y.text();
  expect(metin).not.toContain("kaydedildi");
  expect(metin).not.toMatch(/invalid|ENOTFOUND|fetch failed|e2e/i);
  expect(JSON.parse(metin).mesaj).toMatch(/kaydedilemedi/);
});

test("arayüz, gerçek sunucunun kayıt hatasında başarı göstermez", async ({ page }) => {
  await page.goto("/");
  const a = alanlar(page);
  await formuDoldur(page);
  await a.gonder.click();
  await expect(a.uyari).toHaveText(/kaydedilemedi/);
  await expect(a.basari).toHaveCount(0);
});

test("güvenlik başlıkları", async ({ request }) => {
  const y = await request.get("/");
  const b = y.headers();
  expect(b["x-content-type-options"]).toBe("nosniff");
  expect(b["x-frame-options"]).toBe("DENY");
  expect(b["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(b["x-powered-by"]).toBeUndefined();
  const csp = b["content-security-policy"];
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).not.toContain("unsafe-eval"); // yalnız geliştirme sunucusunda
});

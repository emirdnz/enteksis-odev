import { expect, test } from "@playwright/test";
import { ORNEK, alanlar, erisilebilirlikDenetle, formuDoldur } from "./yardimci";

// Yalnız CANLI_URL verildiğinde çalışır: CANLI_URL=https://... npm run test:e2e
// Canlı veritabanına kurgusal bir kayıt yazar; bu yüzden gönderim tek projede yapılır.

test("canlı sayfa açılır ve erişilebilir", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const tasma = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(tasma).toBeLessThanOrEqual(0);
  await erisilebilirlikDenetle(page);
});

test("canlı API: yöntem ve doğrulama", async ({ request }) => {
  expect((await request.get("/api/basvuru")).status()).toBe(405);
  const y = await request.post("/api/basvuru", { data: { isim: "A" } });
  expect(y.status()).toBe(422);
});

test("canlı gönderim veritabanına yazılır ve kayıt numarası döner", async ({ page }, bilgi) => {
  test.skip(bilgi.project.name !== "masaustu", "Canlı kayıt tek projeden yazılır.");
  await page.goto("/");
  const a = alanlar(page);
  await formuDoldur(page);
  await a.isim.fill(`${ORNEK.isim} E2E`);
  await a.gonder.click();
  await expect(a.basari).toBeVisible({ timeout: 20_000 });
  await expect(a.basari).toContainText(/Kayıt numaranız: \d+/);
});

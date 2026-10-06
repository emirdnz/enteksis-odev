import { expect, test, type Route } from "@playwright/test";
import { ORNEK, alanlar, erisilebilirlikDenetle, formuDoldur } from "./yardimci";

// Bu dosyadaki testlerde API yanıtı tarayıcıda taklit edilir: arayüzün her yanıta
// doğru durumu gösterdiği sınanır. Gerçek sunucu davranışı sunucu.spec.ts'te.

function json(route: Route, status: number, govde: unknown) {
  return route.fulfill({ status, contentType: "application/json", body: JSON.stringify(govde) });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("sayfa: başlık, hizmet, form ve erişilebilirlik", async ({ page }) => {
  await expect(page).toHaveTitle(/Tezgâh/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/defterden çıkarın/);
  await expect(page.getByRole("heading", { name: "Ön görüşme talebi" })).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(3);
  await erisilebilirlikDenetle(page);
});

test("bölüm sırası ve dört örnek ürün ekranı", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 2 })).toHaveText([
    "Tanıdık geliyor mu?",
    "Defter yerine tek ekran",
    "Ofiste, tezgâhta, telefonda",
    "Tezgâh ile ne değişir?",
    "Nasıl çalışır?",
    "Ön görüşme talebi",
  ]);
  await expect(page.getByRole("img", { name: /^Örnek ekran:/ })).toHaveCount(4);
  // Düğme görünümlü öğeler resmin parçası: odak almaz, klavye sırasına girmez.
  await expect(page.locator('[role="img"] :is(a, button, input, select, textarea, [tabindex])')).toHaveCount(0);
});

test("yatay kaydırma yok", async ({ page }) => {
  const tasma = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(tasma).toBeLessThanOrEqual(0);
});

test("başarılı gönderim: gönderiliyor durumu, tek istek, kayıt numarası", async ({ page }) => {
  const istekler: unknown[] = [];
  let birak!: () => void;
  const bekle = new Promise<void>((r) => (birak = r));
  await page.route("**/api/basvuru", async (route) => {
    istekler.push(route.request().postDataJSON());
    await bekle;
    await json(route, 201, { durum: "kaydedildi", kayitNo: 42 });
  });

  const a = alanlar(page);
  await formuDoldur(page);
  await a.isim.fill(`  ${ORNEK.isim}  `);
  await a.gonder.click();

  await expect(a.gonder).toHaveText("Gönderiliyor…");
  await expect(a.gonder).toHaveAttribute("aria-disabled", "true");
  await expect(page.getByRole("status")).toHaveText(/gönderiliyor/);
  await a.gonder.click({ force: true }); // ikinci tıklama yeni istek açmamalı
  await expect(a.basari).toHaveCount(0); // yanıt gelmeden başarı yok

  birak();
  await expect(a.basari).toBeVisible();
  await expect(a.basari).toBeFocused();
  await expect(a.basari).toContainText("42");
  expect(istekler).toEqual([
    { isim: ORNEK.isim, eposta: ORNEK.eposta, hizmet: ORNEK.hizmet, aciklama: ORNEK.aciklama, web_sitesi: "" },
  ]);
  await erisilebilirlikDenetle(page);

  await page.getByRole("button", { name: "Yeni bir talep gönder" }).click();
  await expect(a.isim).toHaveValue("");
});

test("aynı anda iki gönderim (ör. çift Enter) tek istek açar", async ({ page }) => {
  let istekSayisi = 0;
  await page.route("**/api/basvuru", async (route) => {
    istekSayisi++;
    await json(route, 201, { durum: "kaydedildi", kayitNo: 7 });
  });
  await formuDoldur(page);
  // İkisi aynı görevde: ekran "gönderiliyor"a geçmeden ikinci gönderim gelir.
  await page.evaluate(() => {
    const form = document.querySelector("form")!;
    form.requestSubmit();
    form.requestSubmit();
  });
  await expect(alanlar(page).basari).toBeVisible();
  expect(istekSayisi).toBe(1);
});

test("içerik güvenliği politikası sayfada hiçbir şeyi engellemiyor", async ({ page }) => {
  const ihlaller: string[] = [];
  page.on("console", (m) => {
    if (/Content.Security.Policy/i.test(m.text())) ihlaller.push(m.text());
  });
  await page.reload();
  await formuDoldur(page); // form çalışıyorsa Next.js betikleri yüklenmiş demektir
  await expect(alanlar(page).gonder).toBeEnabled();
  expect(ihlaller).toEqual([]);
});

test("istemci doğrulaması: hatalı form sunucuya gitmez, ilk hatalı alana odaklanır", async ({ page }) => {
  let istekSayisi = 0;
  await page.route("**/api/basvuru", (route) => {
    istekSayisi++;
    return json(route, 201, { durum: "kaydedildi", kayitNo: 1 });
  });
  const a = alanlar(page);

  await a.gonder.click();
  await expect(a.isim).toBeFocused();
  await expect(a.isim).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("İsim en az 2 karakter olmalı.")).toBeVisible();
  await expect(page.getByText("E-posta gerekli.")).toBeVisible();
  await expect(page.getByText("Listeden bir hizmet seçin.")).toBeVisible();
  await expect(page.getByText("Açıklama en az 10 karakter olmalı.")).toBeVisible();
  // Hata metni alana bağlı: ekran okuyucu alanla birlikte okur.
  await expect(a.isim).toHaveAccessibleDescription("İsim en az 2 karakter olmalı.");
  await erisilebilirlikDenetle(page);

  // Hata, alan düzeltildikçe kalkar.
  await a.isim.fill(ORNEK.isim);
  await expect(a.isim).not.toHaveAttribute("aria-invalid");
  await a.eposta.fill("deneme@");
  await a.gonder.click();
  await expect(a.eposta).toBeFocused();
  await expect(page.getByText(/Geçerli bir e-posta/)).toBeVisible();

  expect(istekSayisi).toBe(0);
});

test("sunucu alan hatası (422): mesaj ve alan hatası gösterilir", async ({ page }) => {
  await page.route("**/api/basvuru", (route) =>
    json(route, 422, {
      durum: "hata",
      mesaj: "Bazı alanlar hatalı. Lütfen düzeltip tekrar gönderin.",
      alanlar: { eposta: "Geçerli bir e-posta adresi girin (ör. ad@ornek.com)." },
    }),
  );
  const a = alanlar(page);
  await formuDoldur(page);
  await a.gonder.click();

  await expect(a.uyari).toHaveText(/Bazı alanlar hatalı/);
  await expect(a.eposta).toBeFocused();
  await expect(a.eposta).toHaveAttribute("aria-invalid", "true");
  await expect(a.basari).toHaveCount(0);
});

test("sunucu kaydedemedi (500): hata gösterilir, girilen bilgiler korunur", async ({ page }) => {
  await page.route("**/api/basvuru", (route) =>
    json(route, 500, { durum: "hata", mesaj: "Talebiniz şu an kaydedilemedi. Lütfen biraz sonra tekrar deneyin." }),
  );
  const a = alanlar(page);
  await formuDoldur(page);
  await a.gonder.click();

  await expect(a.uyari).toHaveText(/kaydedilemedi/);
  await expect(a.basari).toHaveCount(0);
  await expect(a.isim).toHaveValue(ORNEK.isim);
  await expect(a.aciklama).toHaveValue(ORNEK.aciklama);
  await expect(a.gonder).toHaveText("Talebi gönder");
});

test("başarı yalnız 201 + kaydedildi ile: beklenmeyen yanıtlar hata sayılır", async ({ page }) => {
  const yanitlar = [
    () => ({ status: 200, contentType: "application/json", body: JSON.stringify({ durum: "kaydedildi" }) }),
    () => ({ status: 502, contentType: "text/html", body: "<html>Bad gateway</html>" }),
  ];
  let sira = 0;
  await page.route("**/api/basvuru", (route) => route.fulfill(yanitlar[sira++]()));
  const a = alanlar(page);
  await formuDoldur(page);

  for (let i = 0; i < yanitlar.length; i++) {
    await a.gonder.click();
    await expect(a.uyari).toHaveText(/gönderilemedi/);
    await expect(a.basari).toHaveCount(0);
  }
});

test("ağ hatası: bağlantı mesajı, başarı yok", async ({ page }) => {
  await page.route("**/api/basvuru", (route) => route.abort("internetdisconnected"));
  const a = alanlar(page);
  await formuDoldur(page);
  await a.gonder.click();

  await expect(a.uyari).toHaveText(/Bağlantı kurulamadı/);
  await expect(a.basari).toHaveCount(0);
});

test("yalnız klavyeyle doldurulup gönderilir", async ({ page }) => {
  await page.route("**/api/basvuru", (route) => json(route, 201, { durum: "kaydedildi", kayitNo: 7 }));
  const a = alanlar(page);

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "İçeriğe geç" })).toBeFocused();

  await a.isim.focus();
  await page.keyboard.type(ORNEK.isim);
  await page.keyboard.press("Tab");
  await expect(a.eposta).toBeFocused();
  await page.keyboard.type(ORNEK.eposta);
  await page.keyboard.press("Tab");
  await expect(a.hizmet(/Kurulum/)).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(a.hizmet(ORNEK.hizmetEtiketi)).toBeChecked();
  await page.keyboard.press("Tab");
  await expect(a.aciklama).toBeFocused();
  await page.keyboard.type(ORNEK.aciklama);
  await page.keyboard.press("Tab"); // tuzak alan sekme sırasında yok
  await expect(a.gonder).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(a.basari).toBeFocused();
  await expect(a.basari).toContainText("7");
});

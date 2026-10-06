import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { describe, expect, it } from "vitest";
import { dogrula, type Basvuru } from "@/lib/basvuru";
import { depoKur, type Sorgu } from "@/lib/depo";

// Gerçek Postgres motoru (PGlite, bellek içi): db/sema.sql, göç dosyası ve depo.ts'deki SQL
// canlıdaki gibi çalışır. Amaç: uygulamanın doğrulaması ile veritabanı kısıtlarının aynı kararı vermesi.

const oku = (yol: string) => readFileSync(new URL(`../../${yol}`, import.meta.url), "utf8");
const SEMA = oku("db/sema.sql");
const GOC_001 = oku("db/gocler/001-uzunluk-alt-sinirlari.sql");

// 6 Ekim'de canlıda kurulan şema (commit f1716f2). Göç bu hal üzerinde sınanır.
const ESKI_SEMA = `
  CREATE TABLE basvurular (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    isim text NOT NULL CHECK (char_length(isim) BETWEEN 1 AND 100),
    eposta text NOT NULL CHECK (char_length(eposta) BETWEEN 3 AND 254),
    hizmet text NOT NULL CHECK (hizmet IN ('kurulum', 'aktarim', 'egitim')),
    aciklama text NOT NULL CHECK (char_length(aciklama) BETWEEN 1 AND 2000),
    olusturma timestamptz NOT NULL DEFAULT now());
  CREATE TABLE hiz_siniri (anahtar text NOT NULL, pencere timestamptz NOT NULL,
    sayi integer NOT NULL, PRIMARY KEY (anahtar, pencere));`;

async function veritabani(...betikler: string[]) {
  const db = await PGlite.create();
  for (const b of betikler) await db.exec(b);
  const sorgu: Sorgu = (p, ...d) => db.sql<Record<string, unknown>>(p, ...d).then((s) => s.rows);
  return { db, depo: depoKur(sorgu) };
}

const gecerli: Basvuru = {
  isim: "Deneme Atölye",
  eposta: "deneme@ornek.com",
  hizmet: "kurulum",
  aciklama: "Siparişleri defterde tutuyoruz, dijitale geçmek istiyoruz.",
};

// 🔧 tek karakterdir ama JS'te .length'i 2'dir; sınırların karakterle ölçüldüğünü bu ayırır.
const A = "🔧";
const SINIR_DURUMLARI: [string, Partial<Record<keyof Basvuru, string>>, boolean][] = [
  ["isim 1 karakter", { isim: "A" }, false],
  ["isim 2 karakter", { isim: "Al" }, true],
  ["isim 1 emoji", { isim: A }, false],
  ["isim 2 emoji", { isim: A.repeat(2) }, true],
  ["isim 100 karakter", { isim: "a".repeat(100) }, true],
  ["isim 101 karakter", { isim: "a".repeat(101) }, false],
  ["isim 100 emoji", { isim: A.repeat(100) }, true],
  ["isim 101 emoji", { isim: A.repeat(101) }, false],
  ["açıklama 9 karakter", { aciklama: "1".repeat(9) }, false],
  ["açıklama 10 karakter", { aciklama: "1".repeat(10) }, true],
  ["açıklama 5 emoji (JS uzunluğu 10)", { aciklama: A.repeat(5) }, false],
  ["açıklama 10 emoji", { aciklama: A.repeat(10) }, true],
  ["açıklama 2000 karakter", { aciklama: "ş".repeat(2000) }, true],
  ["açıklama 2001 karakter", { aciklama: "ş".repeat(2001) }, false],
  ["açıklama 2000 emoji", { aciklama: A.repeat(2000) }, true],
  ["açıklama 2001 emoji", { aciklama: A.repeat(2001) }, false],
  ["hizmet aktarim", { hizmet: "aktarim" }, true],
  ["hizmet egitim", { hizmet: "egitim" }, true],
  ["hizmet listede yok", { hizmet: "erp" }, false],
  ["hizmet büyük harf", { hizmet: "KURULUM" }, false],
  ["hizmet boş", { hizmet: "" }, false],
];

// Veritabanı yalnız kısıt ihlaliyle reddederse "kabul etmedi" sayılır; başka hata testi düşürür.
async function veritabaniKabulEder(depo: ReturnType<typeof depoKur>, b: Basvuru) {
  try {
    await depo.kaydet(b);
    return true;
  } catch (e) {
    if ((e as { code?: string }).code === "23514") return false; // check_violation
    throw e;
  }
}

async function sinirlariSina(depo: ReturnType<typeof depoKur>) {
  for (const [ad, degisiklik, beklenen] of SINIR_DURUMLARI) {
    const girdi = { ...gecerli, ...degisiklik } as Basvuru;
    expect(dogrula(girdi).gecerli, `uygulama: ${ad}`).toBe(beklenen);
    expect(await veritabaniKabulEder(depo, girdi), `veritabanı: ${ad}`).toBe(beklenen);
  }
}

describe("veritabanı (gerçek Postgres, PGlite)", () => {
  it("db/sema.sql: sınırlarda uygulama ile veritabanı aynı kararı verir", async () => {
    const { depo } = await veritabani(SEMA);
    await sinirlariSina(depo);
  });

  it("6 Ekim şeması + göç 001: aynı kararı verir; göçten önce veritabanı daha gevşekti", async () => {
    const eski = await veritabani(ESKI_SEMA);
    expect(await veritabaniKabulEder(eski.depo, { ...gecerli, isim: "A" })).toBe(true); // bulunan açık
    const { depo } = await veritabani(ESKI_SEMA, GOC_001);
    await sinirlariSina(depo);
  });

  it("göç 001: kurala uymayan satır varsa hiçbir şeyi değiştirmeden durur", async () => {
    const { db, depo } = await veritabani(ESKI_SEMA);
    await depo.kaydet({ ...gecerli, isim: "A" });
    await expect(db.exec(GOC_001)).rejects.toMatchObject({ code: "23514" });
    const { rows } = await db.query("SELECT isim FROM basvurular");
    expect(rows).toEqual([{ isim: "A" }]);
    const kisitlar = await db.query(
      "SELECT conname FROM pg_constraint WHERE conname LIKE 'basvurular_%_en_az'",
    );
    expect(kisitlar.rows).toEqual([]);
  });

  it("göç 001 yalnız kısıt ekler: silen ya da veri değiştiren komut yok", () => {
    const komutlar = GOC_001.replace(/--.*$/gm, "").trim();
    expect(komutlar).toMatch(/^ALTER TABLE basvurular\s+ADD CONSTRAINT/);
    expect(komutlar).not.toMatch(/\b(DROP|DELETE|TRUNCATE|UPDATE|INSERT)\b/i);
  });

  it("kaydet: id döndürür, kötü niyetli metni olduğu gibi saklar (SQL olarak çalışmaz)", async () => {
    const { db, depo } = await veritabani(SEMA);
    const zararli = {
      ...gecerli,
      isim: "'; DROP TABLE basvurular; --",
      aciklama: `<script>alert("x")</script> ${A} Robert'); --`,
    };
    const no1 = await depo.kaydet(zararli);
    const no2 = await depo.kaydet(gecerli);
    expect(no2).toBe(no1 + 1);
    const { rows } = await db.query("SELECT id, isim, aciklama FROM basvurular WHERE id = $1", [no1]);
    expect(rows).toEqual([{ id: no1, isim: zararli.isim, aciklama: zararli.aciklama }]);
  });

  it("istekSay: aynı anahtar aynı pencerede 1, 2, 3 sayar; farklı anahtar ayrı sayılır", async () => {
    const { depo } = await veritabani(SEMA);
    expect(await depo.istekSay("a")).toBe(1);
    expect(await depo.istekSay("a")).toBe(2);
    expect(await depo.istekSay("a")).toBe(3);
    expect(await depo.istekSay("b")).toBe(1);
  });
});

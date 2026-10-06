// db/gocler/001-uzunluk-alt-sinirlari.sql'i DATABASE_URL'deki veritabanına uygular.
// Yalnız iki CHECK kısıtı ekler; satır silmez, değiştirmez. Canlı veritabanında Emir çalıştırır.
// Kullanım:
//   npm run db:goc -- --kontrol   salt okuma: göç gerekli mi, kurala uymayan satır var mı
//   npm run db:goc                kontrol temizse göçü uygular
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL tanımlı değil (.env.local).");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const yalnizKontrol = process.argv.includes("--kontrol");

const metin = readFileSync(new URL("../db/gocler/001-uzunluk-alt-sinirlari.sql", import.meta.url), "utf8");
const komut = metin.replace(/--.*$/gm, "").trim();
if (!/^ALTER TABLE basvurular\s+ADD CONSTRAINT/.test(komut) || /\b(DROP|DELETE|TRUNCATE|UPDATE|INSERT)\b/i.test(komut)) {
  console.error("Göç dosyası beklenen biçimde değil, durdu.");
  process.exit(1);
}

const kisitlar = async () =>
  (
    await sql`SELECT conname FROM pg_constraint
              WHERE conrelid = 'basvurular'::regclass AND contype = 'c' ORDER BY conname`
  ).map((k) => k.conname);

const once = await kisitlar();
console.log("mevcut CHECK kısıtları:", once.join(", "));
if (once.includes("basvurular_isim_en_az") && once.includes("basvurular_aciklama_en_az")) {
  console.log("Göç 001 zaten uygulanmış. Değişiklik yok.");
  process.exit(0);
}

const [{ toplam, uymayan }] = await sql`
  SELECT count(*)::int AS toplam,
         count(*) FILTER (WHERE char_length(isim) < 2 OR char_length(aciklama) < 10)::int AS uymayan
  FROM basvurular`;
console.log(`satır: ${toplam} · yeni kurala uymayan: ${uymayan}`);
if (uymayan > 0) {
  console.error("Kurala uymayan satır var. Göç uygulanmadı; önce bu satırlara karar verilmeli.");
  process.exit(1);
}

if (yalnizKontrol) {
  console.log("Yalnız kontrol: veritabanına yazılmadı. Uygulamak için: npm run db:goc");
  process.exit(0);
}

await sql.query(komut);
console.log("uygulandı. yeni CHECK kısıtları:", (await kisitlar()).join(", "));

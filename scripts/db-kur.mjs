// db/sema.sql'i DATABASE_URL'deki veritabanında çalıştırır.
// Şema yalnız CREATE TABLE IF NOT EXISTS içerir; tekrar çalıştırmak güvenlidir.
// Kullanım: npm run db:kur   (.env.local'dan okur)
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL tanımlı değil (.env.local).");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const metin = readFileSync(new URL("../db/sema.sql", import.meta.url), "utf8");

const komutlar = metin
  .split(/;\s*$/m)
  .map((k) => k.replace(/^\s*--.*$/gm, "").trim())
  .filter(Boolean);

for (const komut of komutlar) {
  if (!/^CREATE TABLE IF NOT EXISTS /i.test(komut)) {
    console.error("Beklenmeyen komut, durdu:", komut.slice(0, 60));
    process.exit(1);
  }
  await sql.query(komut);
  console.log("tamam:", komut.split("\n")[0]);
}

const tablolar = await sql`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' ORDER BY table_name`;
console.log("tablolar:", tablolar.map((t) => t.table_name).join(", "));

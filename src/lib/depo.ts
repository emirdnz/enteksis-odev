import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { HIZ_SINIRI, type Depo } from "./basvuru-isle";

// Neon'un HTTP sürücüsü: sunucusuz ortamda bağlantı havuzu tutmaz, her sorgu tek istek.
// Tüm değerler etiketli şablonla parametre olarak gider; SQL metnine eklenmez.

let baglanti: NeonQueryFunction<false, false> | undefined;

function sql() {
  const adres = process.env.DATABASE_URL;
  if (!adres) throw new Error("DATABASE_URL tanımlı değil");
  baglanti ??= neon(adres);
  return baglanti;
}

export const neonDepo: Depo = {
  async istekSay(anahtar) {
    const pencere = `${HIZ_SINIRI.pencereDakika} minutes`;
    // Tek sorgu: aynı pencerede satır varsa sayaç atomik olarak artar, yoksa 1 ile açılır.
    const satirlar = await sql()`
      INSERT INTO hiz_siniri (anahtar, pencere, sayi)
      VALUES (${anahtar}, date_bin(${pencere}::interval, now(), timestamptz '2000-01-01'), 1)
      ON CONFLICT (anahtar, pencere) DO UPDATE SET sayi = hiz_siniri.sayi + 1
      RETURNING sayi`;
    return Number(satirlar[0].sayi);
  },

  async kaydet(b) {
    const satirlar = await sql()`
      INSERT INTO basvurular (isim, eposta, hizmet, aciklama)
      VALUES (${b.isim}, ${b.eposta}, ${b.hizmet}, ${b.aciklama})
      RETURNING id`;
    if (!satirlar[0]) throw new Error("INSERT satır döndürmedi");
    return Number(satirlar[0].id);
  },
};

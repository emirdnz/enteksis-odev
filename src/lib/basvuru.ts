import { z } from "zod";

// Bu dosya hem tarayıcıda hem sunucuda çalışır: doğrulama kuralları tek yerde.
// Veritabanı ve Node'a özgü bir şey içe aktarılmaz.

// Formdaki hizmet seçenekleri. Değerler db/sema.sql'deki CHECK kısıtıyla aynı olmalı.
export const HIZMETLER = [
  {
    deger: "kurulum",
    baslik: "Kurulum",
    aciklama: "İş takibini atölyenizin işleyişine göre kurarız.",
  },
  {
    deger: "aktarim",
    baslik: "Defterden aktarım",
    aciklama: "Defterdeki ve kâğıttaki açık işleri sisteme taşırız.",
  },
  {
    deger: "egitim",
    baslik: "Ekip eğitimi",
    aciklama: "Ustalara ve ofise kullanımı yerinde gösteririz.",
  },
] as const;

export type HizmetDegeri = (typeof HIZMETLER)[number]["deger"];

const HIZMET_DEGERLERI = HIZMETLER.map((h) => h.deger) as [HizmetDegeri, ...HizmetDegeri[]];

export const SINIRLAR = {
  isim: { en_az: 2, en_cok: 100 },
  eposta: { en_cok: 254 },
  aciklama: { en_az: 10, en_cok: 2000 },
} as const;

// Postgres metin alanı NUL karakterini kabul etmez; yazmaya gitmeden burada reddedilir.
const nulYok = (s: string) => !s.includes("\u0000");

// Uzunluk, veritabanındaki char_length gibi karakter (kod noktası) sayısıdır. JS'in .length'i
// UTF-16 birimi sayar: bir emoji 2 olur, Postgres'te 1. Sınırlar iki tarafta aynı ölçülsün diye.
export const karakterSayisi = (s: string) => Array.from(s).length;

export const basvuruSemasi = z.object({
  isim: z
    .string({ error: "İsim gerekli." })
    .trim()
    .refine((s) => karakterSayisi(s) >= SINIRLAR.isim.en_az, `İsim en az ${SINIRLAR.isim.en_az} karakter olmalı.`)
    .refine((s) => karakterSayisi(s) <= SINIRLAR.isim.en_cok, `İsim en fazla ${SINIRLAR.isim.en_cok} karakter olabilir.`)
    .refine(nulYok, "İsimde geçersiz karakter var."),
  eposta: z
    .string({ error: "E-posta gerekli." })
    .trim()
    .min(1, "E-posta gerekli.")
    .max(SINIRLAR.eposta.en_cok, `E-posta en fazla ${SINIRLAR.eposta.en_cok} karakter olabilir.`)
    .pipe(z.email("Geçerli bir e-posta adresi girin (ör. ad@ornek.com).")),
  hizmet: z.enum(HIZMET_DEGERLERI, "Listeden bir hizmet seçin."),
  aciklama: z
    .string({ error: "Açıklama gerekli." })
    .trim()
    .refine(
      (s) => karakterSayisi(s) >= SINIRLAR.aciklama.en_az,
      `Açıklama en az ${SINIRLAR.aciklama.en_az} karakter olmalı.`,
    )
    .refine(
      (s) => karakterSayisi(s) <= SINIRLAR.aciklama.en_cok,
      `Açıklama en fazla ${SINIRLAR.aciklama.en_cok} karakter olabilir.`,
    )
    .refine(nulYok, "Açıklamada geçersiz karakter var."),
});

export type Basvuru = z.infer<typeof basvuruSemasi>;
export type AlanAdi = keyof Basvuru;
export type AlanHatalari = Partial<Record<AlanAdi, string>>;

// Ekranda hataların gösterileceği ve odağın gideceği sıra.
export const ALAN_SIRASI: AlanAdi[] = ["isim", "eposta", "hizmet", "aciklama"];

export type DogrulamaSonucu =
  | { gecerli: true; veri: Basvuru }
  | { gecerli: false; hatalar: AlanHatalari };

export function dogrula(girdi: unknown): DogrulamaSonucu {
  const sonuc = basvuruSemasi.safeParse(girdi);
  if (sonuc.success) return { gecerli: true, veri: sonuc.data };

  const alanlar = z.flattenError(sonuc.error).fieldErrors as Partial<Record<AlanAdi, string[]>>;
  const hatalar: AlanHatalari = {};
  for (const ad of ALAN_SIRASI) {
    const ilk = alanlar[ad]?.[0];
    if (ilk) hatalar[ad] = ilk;
  }
  return { gecerli: false, hatalar };
}

// Sunucunun döndürdüğü gövde. İstemci başarıyı yalnız `durum: "kaydedildi"` ile gösterir.
export type BasvuruYaniti =
  | { durum: "kaydedildi"; kayitNo: number }
  | { durum: "hata"; mesaj: string; alanlar?: AlanHatalari };

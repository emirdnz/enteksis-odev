-- Veritabanı şeması. Yalnız yeni tablo açar; mevcut veriye dokunmaz.
-- Çalıştırma: npm run db:kur

-- Form başvuruları. CHECK kısıtları son savunma hattı: uygulamadaki doğrulama
-- atlanırsa bile bozuk veri yazılmaz. Alt sınırlar uygulamada denetlenir.
CREATE TABLE IF NOT EXISTS basvurular (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  isim       text NOT NULL CHECK (char_length(isim) BETWEEN 1 AND 100),
  eposta     text NOT NULL CHECK (char_length(eposta) BETWEEN 3 AND 254),
  hizmet     text NOT NULL CHECK (hizmet IN ('kurulum', 'aktarim', 'egitim')),
  aciklama   text NOT NULL CHECK (char_length(aciklama) BETWEEN 1 AND 2000),
  olusturma  timestamptz NOT NULL DEFAULT now()
);

-- Hız sınırı sayaçları: istemci IP'sinin SHA-256 özeti + 10 dakikalık pencere başına bir satır.
CREATE TABLE IF NOT EXISTS hiz_siniri (
  anahtar  text NOT NULL,
  pencere  timestamptz NOT NULL,
  sayi     integer NOT NULL,
  PRIMARY KEY (anahtar, pencere)
);

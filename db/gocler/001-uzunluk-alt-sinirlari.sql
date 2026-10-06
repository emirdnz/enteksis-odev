-- 001 · İsim ve açıklamanın alt sınırını veritabanında da uygulamayla aynı yapar.
--
-- Neden: 6 Ekim'de kurulan canlı tabloda isim 1–100, açıklama 1–2000 karakterdi;
-- uygulama 2–100 ve 10–2000 kabul ediyor. Uygulama atlanırsa veritabanı da aynı kuralı uygulasın.
--
-- Ne yapar: Yalnız iki CHECK kısıtı EKLER. Satır silmez, değiştirmez, eski kısıtı kaldırmaz
-- (eski 1–100 / 1–2000 kısıtları yerinde kalır; yenisi daha dar olduğu için etkisizleşir).
-- Mevcut bir satır yeni kurala uymuyorsa Postgres komutu reddeder ve hiçbir şey değişmez.
--
-- Önce kontrol (salt okuma; 0 olmalı):
--   SELECT count(*) FROM basvurular WHERE char_length(isim) < 2 OR char_length(aciklama) < 10;
--
-- Geri dönüş (yalnız bu iki kısıtı kaldırır, veriye dokunmaz):
--   ALTER TABLE basvurular DROP CONSTRAINT basvurular_isim_en_az, DROP CONSTRAINT basvurular_aciklama_en_az;
--
-- Çalıştırma: Emir, `npm run db:goc` (önce kontrol sorgusunu çalıştırır, 0 değilse durur).
-- Yalnız 6 Ekim şemasıyla kurulmuş veritabanı için, bir kez. Yeni kurulumda db/sema.sql yeterli.

ALTER TABLE basvurular
  ADD CONSTRAINT basvurular_isim_en_az CHECK (char_length(isim) >= 2),
  ADD CONSTRAINT basvurular_aciklama_en_az CHECK (char_length(aciklama) >= 10);

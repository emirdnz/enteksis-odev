# ChatGPT kullanımı

ChatGPT'yi plan ve kod incelemesi için kullandım. Otomatik kaydı yok, bu yüzden her danışma burada:
gönderdiğim istem, cevabın özeti, ne kabul edip ne reddettiğim. ChatGPT'nin cevabını Claude Code
sohbetine de yapıştırdım; tam metni o saatin dökümünde (`ai-log/oturumlar/`) duruyor.

| # | Saat | Konu | Kabul | Ret | Döküm |
|---|---|---|---|---|---|
| 1 | 6 Eki 14.15 → cevap 14.22 | Durum bildirimi + plan danışması | 6 öneri | 0 | `oturumlar/2026-10-06_1403_8069d3ff.md` |

---

## 1 · Durum bildirimi ve plan danışması (6 Eki 14.15)

İstemi Claude Code hazırladı, Emir gönderdi.

```text
Merhaba. Bir iş başvurusu için 24 saatlik teknik ödev yapıyorum. Kodu Claude Code yazıyor,
kararları ben veriyorum. Senin rolün: planı ve riskleri incelemek, gözden kaçanı söylemek.
Kod yazmana gerek yok; önerilerini gerekçesiyle, kısa ve maddeli ver.

ÖDEV
- Bir hizmet için landing page (mobil + masaüstü)
- Form: isim, e-posta, hizmet seçimi, açıklama
- İstemci + sunucu doğrulaması; gönderiliyor / başarı / hata durumları
- Sunucuda kalıcı kayıt; başarı mesajı yalnız kayıt gerçekten yazıldıysa
- Teslim: canlı URL, repo, README, AI_LOG.md, commit kimliği. Yalnız kurgusal test verisi.
- Süre: 6 Eki 13.53 → 7 Eki 13.52 (hedef 3–4 saat aktif emek)

PUANLAMA (100)
Ürün 25 · Mühendislik/güvenlik 20 · AI ile üretim 20 · Erişilebilirlik 10 · Test ve teslim 10 ·
Yazılı problem çözme 10 · Geçmiş katkı 5. Rehber: "Sade ve işlevsel arayüz tam puan alabilir."
Değerlendirici önce çalışan form, kalıcı kayıt, sunucu doğrulaması ve hata durumlarına bakıyor.

KARARLARIM
- Next.js 16 + TypeScript; ORM yok, @neondatabase/serverless ile parametreli sorgu
- Veritabanı Neon (Postgres), yayın Netlify (olmazsa Render); repo public; sade arayüz
- Tek doğrulama şeması tarayıcıda ve sunucuda: isim 2–100, e-posta biçimi, hizmet listeden,
  açıklama 10–2000
- Kötüye kullanım: gizli tuzak alanı, istek boyutu sınırı, hız sınırı veritabanında
  (sunucusuz ortamda bellek sayacı çalışmaz)
- Testler: doğrulama birim testleri; sunucu testleri (geçerli → kayıt var, geçersiz → kayıt yok,
  DB hatası → başarı yok); Playwright ile başarılı/hatalı/klavye akışı + axe erişilebilirlik taraması

ŞU ANKİ DURUM
- Next.js iskeleti kurulu, build geçiyor
- AI kayıt altyapısı kuruldu: Claude Code hook'ları her istemi, her araç çağrısını ve konuşma
  dökümünü repoda ai-log/ klasörüne otomatik yazıyor (şifre ve yerel yollar maskeli).
  AI_LOG.md bunun özeti. Seninle konuşmalarımı ai-log/chatgpt.md'ye ekliyorum.
- Henüz yok: GitHub reposu, Netlify, Neon bağlantısı; hizmet seçilmedi

SORULARIM
1. Hizmet seçimi — hangisi en uygun, neden?
   a) Küçük üretim atölyelerinde iş takibini kâğıttan dijitale taşıma (gerçek deneyimim var:
      aile atölyesinde işler kâğıt-defterle takip ediliyordu, bunun için ERP yazdım)
   b) İşletmelere görev otomasyonu
   c) Küçük işletmelere site + teklif formu
2. Planda risk/eksik var mı? Özellikle Netlify + Neon + Next.js 16, hız sınırı tasarımı ve
   "başarı yalnız kayıt sonrası" kuralı.
3. Testler bu puanlama için yeterli mi, fazla mı? Neyi çıkarır, neyi eklersin?
4. AI kayıt yöntemim "AI ile üretim" için yeterli mi (kararlar ve doğrulama tekrarlanabilir
   olmalı)? Eksik ne?
5. Zaman planı gerçekçi mi? İskelet+yayın 30 dk · form+doğrulama+kayıt 1 sa ·
   landing+erişilebilirlik 45 dk · testler 45 dk · README+AI_LOG+canlı kontrol 30 dk
6. (Ödev sayfasında yazılı senaryo sorusu varsa buraya yapıştır) Nasıl yaklaşmalıyım?
```

**Cevap özeti (14.22, tam metin dökümde):**

1. **Hizmet:** (a) atölye iş takibi — gerçek deneyime dayanıyor, adayı ayırıyor. Ama ERP'ye genişletme;
   tek hizmet, 3 fayda, formda 3 küçük seçenek.
2. **Mimari:** Next.js 16 + Netlify + Neon doğru, değiştirme. DB yalnız sunucuda; `DATABASE_URL`
   Netlify ortam değişkeni; ham DB hatası kullanıcıya gösterilmez; POST dışı reddedilir; büyük gövde
   ayrıştırmadan önce kontrol edilir.
3. **Hız sınırı:** DB tabanlı sınır bu ödev için fazla iş olabilir → önce form, sınır en sona, basit ve
   atomik. IP istemci başlığından körlemesine alınmaz; Netlify'nin sunucu tarafı IP bilgisi kullanılır.
4. **Testler:** doğru seviyede, artırma. "Başarı yalnız kayıt oluşunca" kuralı ayrı, görünür bir test olsun.
   Son elle kontrol: mobil → masaüstü → yanlış veri → DB'de kayıt → DB hatası → canlı URL.
5. **AI kaydı:** yeterli; altyapıyı daha fazla geliştirme. Değerlendirici için asıl değer AI_LOG.md:
   istek → AI önerisi → karar → doğrulama → değişiklik. Public repo: commit öncesi gizli değer taraması.
6. **Zaman:** 3,5 saat fazla sıkı → 4 saat (30 dk tampon). Önce canlı iskelet, sonra
   form → POST → doğrulama → DB → başarı zinciri; landing tasarımı bu zincir çalışmadan bitirilmez.
7. **Yazılı senaryo:** metin verilmedi, uydurulmasın. Yaklaşım: durumu anla → varsayım → risk →
   küçük ve geri alınabilir adım → ölç → gerekçelendir.

**Kabul edilen / reddedilen öneriler (Emir karar verir; Claude Code görüşü):**

| Öneri | Durum | Not |
|---|---|---|
| Hizmet (a), dar kapsam | Kabul (Emir, 14.27) | Claude Code da (a) önermişti |
| Mimari aynı kalsın + sunucu kuralları | Kabul | Plana zaten uyuyor; "POST dışı ret" ve "ham hata gizli" teste eklenecek |
| Hız sınırı sona, basit | Kabul | Tek tablo + tek sorgu; Netlify'nin koyduğu `x-nf-client-connection-ip` başlığı kullanılacak |
| "Başarı yalnız kayıt sonrası" ayrı test | Kabul | |
| Kayıt altyapısını büyütme | Kabul | Bu danışmadan sonra yalnız kişisel bilgi temizliği bitirildi, yeni özellik eklenmedi |
| Önce canlı iskelet, 4 saatlik plan | Kabul | |

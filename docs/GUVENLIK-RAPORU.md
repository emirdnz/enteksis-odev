# Güvenlik raporu

Teslim öncesi denetim, 6 Ekim 2026. Her madde: durum ve nasıl doğrulandığı.
Bulunan ve düzeltilen 3 sorun (veritabanı sınırı, uzunluk ölçüsü, çift gönderim) aşağıda ayrıca yazılı.

## 1. API (`POST /api/basvuru`)

| Madde | Durum | Kanıt |
|---|---|---|
| Yalnız `POST` | Var | `route.ts` yalnız `POST` tanımlar. e2e ve canlı: `GET` → 405 |
| JSON zorunlu | Var | Başka içerik türü → 415 (birim + e2e). Sıradan site dışı form gönderimini de engeller |
| Gövde sınırı 16 KB | Var | `Content-Length` büyükse okunmadan 413; başlık yoksa akış okunurken kesilir, 413 (birim, 2 test) |
| Bozuk JSON | Var | 400 (birim) |
| Tuzak alan `web_sitesi` | Var | Doluysa 400, kayıt yok (birim). Alan sekme sırasında ve ekran okuyucuda yok (e2e klavye testi) |
| Sunucu doğrulaması | Var | Tarayıcıyla aynı zod şeması; 422 + alan hataları (birim, e2e, canlı) |
| Hız sınırı | Var | 10 dakikada 5 istek, sonra 429 + `Retry-After: 600` (birim). Sayaç veritabanında tek atomik sorgu; aynı anahtar 1, 2, 3 sayar, farklı anahtar ayrı sayılır (gerçek Postgres testi) |
| İstemci anahtarı | Var | Netlify'ın yazdığı `x-nf-client-connection-ip`; istemcinin sahteleyebildiği `X-Forwarded-For` kullanılmaz. IP açık saklanmaz, SHA-256 özeti saklanır. Canlıda anahtarın yedek değer olmadığı 15.53'te doğrulandı |
| Parametreli SQL | Var | `@neondatabase/serverless` etiketli şablon; ORM yok. Test: `'; DROP TABLE basvurular; --` ve `<script>…` metni olduğu gibi saklandı, SQL olarak çalışmadı (gerçek Postgres) |
| İç hata sızmaz | Var | Veritabanı hatasında kullanıcıya genel mesaj, 500. Yanıtta sürücü mesajı, adres yok (birim + e2e) |
| Günlükte şifre yok | Var | Hata günlüğünde bağlantı adresinin kullanıcı adı ve şifresi `//***@` ile maskelenir (K22, birim testi) |
| Önbellek | Var | Her API yanıtında `Cache-Control: no-store` (`basvuru-isle.ts`). Testi yok; son doğrulamada `curl` ile bakılacak |
| Çift gönderim | Var (düzeltildi) | Aşağıda, Bulgu 3 |
| Gizli değer kodda değil | Var | `DATABASE_URL` yalnız `.env.local` (git dışı) ve Netlify ortam değişkeninde. Repoda yalnız `.env.example` |

## 2. Güvenlik başlıkları

Hepsi `next.config.ts`'ten, her yanıtta. e2e testi başlıkları gerçek sunucuda okur.

| Başlık | Değer |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `X-Powered-By` | Kapalı |
| `Strict-Transport-Security` | Netlify gönderiyor: `max-age=31536000; includeSubDomains; preload` (canlıda `curl` ile görüldü). Kodda ayrıca eklenmedi |

**CSP kararı (nonce'suz):** Next.js sayfaya kendi satır içi betiklerini koyar. Nonce kullanılırsa her istek
dinamik olur, sayfa statik kalamaz. Bu yüzden `script-src`'de `'unsafe-inline'` var. Ne kazanıldı:
dışarıdan betik, yazı tipi, stil yüklenemez; veri başka adrese gönderilemez (`connect-src 'self'`);
sayfa başka sitede çerçevelenemez; form başka adrese gönderilemez. Ne kazanılmadı: sayfaya satır içi betik
sızarsa CSP onu durdurmaz. Sayfa kullanıcı verisini hiç göstermediği için bu yol bugün yok.
`'unsafe-eval'` yalnız `next dev`'de; üretimde olmadığını e2e sınıyor. CSP ihlali olmadığını e2e sınıyor
(konsolda CSP mesajı yok, form çalışıyor).

## 3. Bulunan ve düzeltilen sorunlar

**Bulgu 1 — Veritabanı kuralı uygulamadan gevşekti.** `db/sema.sql`'de isim en az 1, açıklama en az 1
karakterdi; uygulamada 2 ve 10. Uygulama doğrulaması atlanırsa (ör. sonradan yazılacak başka bir uç)
veritabanı 1 karakterlik kaydı kabul ederdi.
- Düzeltme: `db/sema.sql` 2 ve 10 (`c194ec0`). Canlı için `db/gocler/001-uzunluk-alt-sinirlari.sql`:
  yalnız `ADD CONSTRAINT`. Kurala uymayan satır varsa Postgres komutu reddeder, hiçbir şey değişmez.
  Geri dönüş yolu dosyada yazılı (`DROP CONSTRAINT`, yalnız eklenen iki kısıt).
- Test: gerçek Postgres (PGlite) üzerinde 21 sınır durumunda uygulama ve veritabanı aynı kararı veriyor;
  eski şemanın "A"yı kabul ettiği de testte görülüyor.
- **Canlı veritabanı:** göç henüz çalıştırılmadı. Kural gereği Emir çalıştırır: `npm run db:goc`.
  Salt okuma ön kontrolü (16.54): 2 satır, kurala uymayan 0.

**Bulgu 2 — Uzunluk iki yerde farklı ölçülüyordu.** JavaScript `length` emojiyi 2 sayar, Postgres
`char_length` 1. 50 emojilik bir isim uygulamada 100, veritabanında 50 sayılırdı.
- Düzeltme: uygulama karakter (kod noktası) sayar, Postgres'le aynı (`karakterSayisi`, `c194ec0`).
- Test: emojili sınır durumları birim ve veritabanı testinde. Düzeltme geri alınınca 3 test düştü
  (bilerek bozup denendi, sonra geri alındı).

**Bulgu 3 — Çift gönderim aynı anda iki istek açabiliyordu.** Düğme kilidi React durumuna bakıyordu;
iki gönderim aynı görevde gelirse (ör. çift Enter) ikincisi durumu henüz eski görüyordu.
- Önce test yazıldı: `form.requestSubmit()` iki kez art arda → kilitten önce **2 istek** gitti, test düştü.
- Düzeltme: `useRef` kilidi; doğrulama geçince kapanır, yanıt gelince açılır (`e89d032`). Test: 1 istek.

## 4. Repo ve bağımlılıklar

| Kontrol | Sonuç |
|---|---|
| Gizli değer taraması (her commit öncesi) | Bağlantı adresi, `npg_`/`ghp_`/`nfp_` token, yerel kullanıcı yolu desenleri: 0. Kişisel terimler repo dışı yerel listeyle aranır; listenin kendisi commit'lenmez |
| GitHub secret scanning + push protection | Açık, uyarı 0 (16.40) |
| GitHub Dependabot | Kapalı. Açmak repo ayarı; Emir'e bırakıldı |
| `npm audit --omit=dev` (yayına giden paketler) | 0 açık |
| `npm audit` (geliştirme dahil) | 5 yüksek: `braces` → `micromatch` → `fast-glob` → `@next/eslint-plugin-next` → `eslint-config-next` 16.3.8. Yalnız lint aracında; yayına gitmez. npm'in önerdiği "düzeltme" `eslint-config-next` 14.2.35'e geri inmek, Next 16 ile uyumsuz → uygulanmadı |
| Ham AI kaydı public | Emir'in kararı: kalır (AI ile üretim kanıtı). Yazılırken gizli değer, yerel yol ve yerel listedeki kişisel terimler maskelenir |

## 5. Kalan riskler

| Risk | Etki | Neden şimdi değil / ne yapılır |
|---|---|---|
| Canlı veritabanında göç 001 bekliyor | Uygulama doğrulaması atlanırsa veritabanı kısa kaydı kabul eder | Emir çalıştıracak (`npm run db:goc`) |
| Aynı NAT arkasındaki kullanıcılar tek sayaç | Ofis/okul ağından 10 dakikada 5'ten fazla gerçek başvuru 429 alır | Bu ölçekte kabul edilebilir; README'de yazılı |
| IP özeti tuzsuz SHA-256 | IPv4 uzayı küçük, özet tersine çevrilebilir. Takma addır, anonim değil | Sonraki adım: gizli anahtarla HMAC |
| Hız sınırı tablosu temizlenmiyor | Tablo zamanla büyür | Kalıcı kullanımda zamanlanmış temizlik |
| CSP'de `'unsafe-inline'` | Sızan satır içi betiği durdurmaz | Sayfa statik kalsın diye bilerek; sayfa kullanıcı verisi göstermiyor |
| Zaman aşımında çift kayıt | Yanıt gelmeden kayıt yazılmışsa kullanıcı tekrar gönderebilir | Kullanıcıya beklemesi söylenir; idempotency anahtarı yok |
| `c33e7f4` commit'inde bir kişisel terim | Geçmişte duruyor (6 Ekim 15.00 olayı, AI_LOG Hatalar) | Geçmişi yeniden yazmak Emir'in kararı |

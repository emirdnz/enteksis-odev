# Test raporu

Testler sayı için çoğaltılmadı; her biri bir kabul ölçütünü ya da bulunan bir hatayı sınar.
Son tam koşu: 6 Ekim 2026, 18.16 (birim, lint, tip, derleme, e2e); canlı 18.17 (kayıt yazan test hariç). Son doğrulama sonuçları `AI_LOG.md`'de.

## Sayılar

| Katman | Komut | Dosya | Sonuç |
|---|---|---|---|
| Birim + API + veritabanı | `npm test` (Vitest) | `basvuru` 8 · `api` 12 · `veritabani` 6 | **26/26** |
| Uçtan uca (yerel) | `npm run test:e2e` (Playwright) | `form` 14 · `sunucu` 6, her biri mobil + masaüstü | **40/40** |
| Uçtan uca (canlı) | `CANLI_URL=https://enteksisodev.netlify.app npm run test:e2e` | `canli` 3 | 18.17: kayıt yazan test hariç 4/4. 17.18: 5 geçti, 1 atlandı (kayıt yalnız masaüstünden yazılır) |
| Lint | `npm run lint` | — | 0 hata, 0 uyarı |
| Tip | `npx tsc --noEmit` | — | 0 hata |
| Derleme | `npm run build` | — | Geçti; `/` statik, `/api/basvuru` dinamik |

## Test ortamı

- **Birim / API:** sunucu mantığı (`basvuruIsle`) sahte bir depoyla çağrılır; veritabanı hataları istenen anda üretilir.
- **Veritabanı:** PGlite — bellekte çalışan gerçek Postgres (yalnız geliştirme bağımlılığı). `db/sema.sql`,
  6 Ekim'deki eski şema ve göç 001 gerçekten çalıştırılır; uygulamanın `depoKur` sorguları aynen sınanır.
- **E2E:** üretim derlemesi (`next build && next start`). Sunucu bilerek **ulaşılamayan** bir veritabanı adresiyle
  açılır: testler gerçek veriye yazmaz, "kayıt yazılamazsa başarı yok" kuralı gerçek sunucuda sınanır.
  Arayüz durumları için API yanıtı tarayıcıda taklit edilir (201, 422, 500, 200, 502, ağ hatası).
- **Erişilebilirlik:** axe, WCAG 2.0, 2.1 ve 2.2 A/AA kuralları. Üç durumda (boş sayfa, alan hataları, başarı),
  iki ekranda; canlıda bir kez.
- **Ekranlar:** mobil 390×844, masaüstü 1280×800.

## Kabul ölçütü → test

| Ölçüt | Testler |
|---|---|
| Başarı yalnız kayıt yazıldıysa | Birim: "veritabanı yazamazsa → 500…", "veritabanına hiç ulaşılamazsa…", "yanıt, kaydet() tamamlanmadan dönmez". E2E: "veritabanına yazılamazsa → 500…", "arayüz, gerçek sunucunun kayıt hatasında başarı göstermez", "başarı yalnız 201 + kaydedildi ile…". Canlı: "canlı gönderim veritabanına yazılır…" |
| Kalıcı kayıt | Veritabanı: "kaydet: id döndürür…". Canlı: kayıt numarası döner. Elle (17.19): Emir yerelde gönderdi, ekranda kayıt 4; veritabanında 4 numara var (salt okuma sorgusu) |
| İstemci doğrulaması | E2E: "istemci doğrulaması: hatalı form sunucuya gitmez…" (istek sayısı 0) |
| Sunucu doğrulaması | Birim: "geçersiz başvuru → 422…", şema testleri (isim, e-posta, hizmet, açıklama, eksik alan, NUL). E2E ve canlı: 422 |
| Uygulama = veritabanı kuralı | Veritabanı: "db/sema.sql: sınırlarda… aynı kararı verir" (21 durum), "6 Ekim şeması + göç 001…" |
| Göç güvenli | Veritabanı: "göç 001: kurala uymayan satır varsa hiçbir şeyi değiştirmeden durur", "göç 001 yalnız kısıt ekler…" |
| Gönderiliyor / başarı / hata | E2E: "başarılı gönderim…", "sunucu alan hatası (422)…", "sunucu kaydedemedi (500)…", "ağ hatası…" |
| Tek istek | E2E: "başarılı gönderim…" (bekleyen istek sırasında ikinci tıklama), "aynı anda iki gönderim (ör. çift Enter) tek istek açar" |
| Kötüye kullanım | Birim: tuzak alan 400, 415, bozuk JSON 400, 413 (iki yol), hız sınırı 429. Veritabanı: "istekSay…", SQL metni olduğu gibi saklanır |
| Güvenlik başlıkları ve CSP | E2E: "güvenlik başlıkları" (CSP, `unsafe-eval` yok), "içerik güvenliği politikası sayfada hiçbir şeyi engellemiyor" |
| Mobil + masaüstü | Bütün e2e iki ekranda; "yatay kaydırma yok" |
| Erişilebilirlik | E2E: axe 3 durumda; "yalnız klavyeyle doldurulup gönderilir"; "bölüm sırası ve dört örnek ürün ekranı" (örnek ekranlarda odak alan öğe yok); “Başa dön” düğmesi aşağıda belirir, sayfa başına götürür, odak başa geçer, en üstte gizli; sık sorulan sorular klavyeyle açılır |
| Hizmet sayfası | E2E: "sayfa: başlık, hizmet, form…", "bölüm sırası ve dört örnek ürün ekranı" |
| Günlükte şifre yok | Birim: "sunucu günlüğüne bağlantı adresindeki şifre yazılmaz" |

## Testlerin hata yakaladığının kanıtı

| Ne | Nasıl | Sonuç |
|---|---|---|
| Çift gönderim | Test, düzeltmeden **önce** yazıldı ve koşuldu | Kilitten önce 2 istek gitti, test düştü. `useRef` kilidiyle 1 istek, geçti |
| Uzunluk ölçüsü | Düzeltme bilerek geri alındı (UTF-16 sayımı), testler koşuldu, sonra düzeltme geri kondu | 3 test düştü; geri koyunca hepsi geçti |
| Veritabanı sınırı | Eski 6 Ekim şeması testte aynen kuruldu | Eski şema 1 karakterlik ismi kabul ediyor (hata görünür); göç 001'den sonra uygulamayla aynı |
| Kayıt yazılamazsa başarı yok | E2E sunucusu ulaşılamayan veritabanıyla; canlıda değişken eksikken (15.08) | Her ikisinde 500, başarı gösterilmedi |

## Test edilmeyenler

- 15 sn zaman aşımı mesajı (kodda var, e2e'de taklit edilmedi).
- Hız sınırının gerçek Netlify arkasında 6. istekte 429 vermesi: birim ve veritabanı testinde var,
  canlıda bilerek denenmedi (önce 5 gerçek kayıt yazmak gerekirdi).
- `Cache-Control: no-store`: otomatik testi yok; canlıda `curl` ile görüldü (17.18).

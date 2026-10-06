# Tezgâh — küçük atölyeler için dijital iş takibi

Enteksis teknik değerlendirme ödevi. Kurgusal bir hizmet için tanıtım sayfası ve ön görüşme formu.
Form kaydı Postgres'e yazılır; **başarı mesajı yalnız kayıt gerçekten yazıldıysa gösterilir.**

- **Canlı adres:** https://enteksisodev.netlify.app
- **Repo:** https://github.com/emirdnz/enteksis-odev
- **AI kullanımı:** [`AI_LOG.md`](AI_LOG.md) (özet, kararlar, doğrulama) ve [`ai-log/`](ai-log) (otomatik ham kayıt)

## Ne yapar

Küçük üretim atölyelerinde siparişlerin defterden dijitale taşınması. Sayfa üç faydayı (işler tek yerde,
durumlar görünür, deftere bağımlılık azalır) ve üç hizmeti (kurulum, defterden aktarım, ekip eğitimi) anlatır.
Form alanları: isim, e-posta, hizmet seçimi, açıklama.

## Mimari

```
Tarayıcı                         Sunucu (Next.js route handler)            Veritabanı
BasvuruFormu.tsx  ──POST JSON──▶ /api/basvuru → basvuruIsle()  ──SQL──▶  Neon Postgres
  dogrula() (zod)                  dogrula() (aynı şema)                    basvurular
                                   Depo arayüzü → neonDepo                  hiz_siniri
```

| Dosya | Görev |
|---|---|
| `src/lib/basvuru.ts` | Tek doğrulama şeması (zod). Tarayıcı ve sunucu aynı kuralı kullanır |
| `src/lib/basvuru-isle.ts` | İstek işleme: biçim, boyut, tuzak alan, doğrulama, hız sınırı, kayıt |
| `src/lib/depo.ts` | Veritabanı erişimi (`@neondatabase/serverless`, parametreli sorgu, ORM yok) |
| `src/app/api/basvuru/route.ts` | Yalnız `POST`; diğer yöntemlere Next.js 405 döner |
| `src/app/BasvuruFormu.tsx` | Form: alan hataları, gönderiliyor / başarı / hata durumları, odak yönetimi |
| `db/sema.sql` | Tablolar ve `CHECK` kısıtları (yalnız `CREATE TABLE IF NOT EXISTS`) |

### Sunucuda istek sırası

| Adım | Koşul | Yanıt |
|---|---|---|
| 1 | `Content-Type` JSON değil | 415 |
| 2 | Gövde 16 KB'tan büyük (başlık ya da akış okunurken) | 413 |
| 3 | JSON çözülemiyor | 400 |
| 4 | Gizli tuzak alan (`web_sitesi`) dolu | 400 |
| 5 | Şemaya uymuyor | 422 + alan hataları |
| 6 | Aynı istemciden 10 dakikada 5'ten fazla istek | 429 + `Retry-After` |
| 7 | `INSERT … RETURNING id` döndü | **201** `{ durum: "kaydedildi", kayitNo }` |
| — | Veritabanı hatası (sayaç ya da kayıt) | 500, genel mesaj; ham hata yalnız sunucu günlüğüne, bağlantı adresindeki kullanıcı adı ve şifre maskelenerek |

Arayüz başarıyı yalnız **201 ve `durum: "kaydedildi"`** birlikte gelirse gösterir. 200, 502, HTML hata
sayfası, zaman aşımı (15 sn) ve ağ hatası hata olarak gösterilir; girilen bilgiler silinmez.

## Kurulum

Gerekenler: Node 20.9+ (Netlify'da 22), bir Postgres adresi (Neon havuzlu bağlantı önerilir).

```bash
npm ci
cp .env.example .env.local     # DATABASE_URL'i doldurun
npm run db:kur                 # tabloları açar; tekrar çalıştırmak güvenli
npm run dev                    # http://localhost:3000
```

## Testler

| Komut | Ne sınar | Son sonuç |
|---|---|---|
| `npm test` | Şema sınırları; API: 201/422/415/413/400/429/500, başarının kayıttan önce dönmediği, ham hatanın sızmadığı, günlükte bağlantı şifresinin maskelendiği (sahte depo ile) | 19/19 |
| `npm run test:e2e` | Mobil (390×844) ve masaüstü (1280×800): form akışları, klavyeyle kullanım, axe (WCAG 2.2 AA), gerçek sunucuda 405/415/422/500, güvenlik başlıkları | 30/30 |
| `CANLI_URL=https://… npm run test:e2e` | Canlı adres: sayfa, erişilebilirlik, API, bir kurgusal kayıt | 5 geçti, 1 atlandı (kayıt yalnız masaüstü projesinde) |

E2E testleri gerçek veritabanına **yazmaz**: yerel sunucu bilerek ulaşılamayan bir veritabanı adresiyle
açılır. Böylece "veritabanı yazamazsa başarı gösterilmez" kuralı gerçek sunucuda da sınanır.

## Güvenlik ve kötüye kullanım

- SQL yalnız parametreli; veritabanında `CHECK` kısıtları son savunma hattı.
- Gövde boyutu sınırı, JSON zorunluluğu (sıradan site dışı form gönderimini de engeller), tuzak alan.
- Hız sınırı veritabanında, tek atomik sorguyla (`INSERT … ON CONFLICT DO UPDATE … RETURNING`).
  İstemci anahtarı Netlify'ın yazdığı `x-nf-client-connection-ip` başlığından alınır; istemcinin
  sahteleyebildiği `X-Forwarded-For` kullanılmaz. IP açık değil SHA-256 özeti olarak saklanır.
- Güvenlik başlıkları: `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`;
  `X-Powered-By` kapalı.

## Erişilebilirlik

`lang="tr"`, "İçeriğe geç" bağlantısı, her alanın etiketi, hata metinleri `aria-describedby` ile alana bağlı,
gönderimde ilk hatalı alana odak, başarı panelinde odak, `role="alert"` / `role="status"` duyuruları,
görünür odak çizgisi, yalnız klavyeyle tam akış (e2e testinde sınanıyor).

## Bilinen sınırlar

- Hız sınırı tablosundaki eski pencereler silinmiyor; kalıcı kullanımda zamanlanmış bir temizlik gerekir.
- IP özeti tuzsuz SHA-256: IPv4 uzayı küçük olduğu için tersine çevrilebilir. Takma addır, anonim değildir.
  Sonraki adım: gizli bir anahtarla HMAC.
- Hız sınırı Netlify başlığına dayanır; başka bir barındırmada başlık yoksa tüm istemciler tek anahtarda toplanır.
- E-posta adresi doğrulanmaz, onay e-postası gönderilmez; kayıtlar için yönetim ekranı yok (SQL ile okunur).
- Zaman aşımında kayıt yazılmış olabilir; kullanıcıya tekrar göndermeden önce beklemesi söylenir,
  ama çift kayıt tamamen engellenmez (idempotency anahtarı yok).

Forma yalnız kurgusal test verisi girin.
